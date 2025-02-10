import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentService {
  private readonly PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
  private readonly INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
  private readonly IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  // Step 1: Authenticate with Paymob and get a token
  private async getAuthToken(): Promise<string> {
    const requestBody = {
        api_key: this.PAYMOB_API_KEY,
    };

    console.log('🔍 Sending Auth Request:', requestBody); // Log before sending

    try {
        const response = await axios.post(
            'https://accept.paymob.com/api/auth/tokens',
            requestBody,
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('✅ Auth Token Response:', response.data);
        return response.data.token;
    } catch (error) {
        console.error('❌ Auth Request Failed:', error.response?.data || error.message);
        throw new InternalServerErrorException('Failed to authenticate with Paymob');
    }
}

  // Step 2: Register an order in Paymob
  private async createPaymobOrder(authToken: string, order: Order) {
    const response = await axios.post('https://accept.paymob.com/api/ecommerce/orders', {
      auth_token: authToken,
      delivery_needed: "false",
      amount_cents: order.totalPrice * 100,
      currency: "EGP",
      items: order.items.map((item) => ({
        name: item.product.name,
        amount_cents: item.price * 100,
        quantity: item.quantity,
      })),
    });

    return response.data.id;
  }

  // Step 3: Generate a payment key
  private async generatePaymentKey(authToken: string, orderId: number, order: Order): Promise<string> {
    const response = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
      auth_token: authToken,
      amount_cents: order.totalPrice * 100,
      currency: "EGP",
      order_id: orderId,
      integration_id: this.INTEGRATION_ID,
      billing_data: {
        first_name: order.user.first_name || "test",
        email: order.user.email,
        phone_number: "0000000000",  // order.user.phone || "0000000000"
        city: "Cairo",
        country: "EG",

        last_name: order.user.last_name || "test",
        street: "asdf",
        building: "asdf",
        floor: "10",
        apartment: "asdf"
      },
    });

    return response.data.token;
  }

  // Public method to initiate payment
  async createPayment(orderId: number) {
    console.log(`🔍 Fetching order with ID: ${orderId}`);

    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['user', 'items', 'items.product'] });

    if (!order) {
        console.error('❌ Order not found');
        throw new NotFoundException('Order not found');
    }
    
    console.log(`✅ Order found: ${order.id}`);

    console.log(order)

    const authToken = await this.getAuthToken();
    console.log(`✅ Auth token received: ${authToken.substring(0, 6)}...`); // Log partial token

    const paymobOrderId = await this.createPaymobOrder(authToken, order);
    console.log(`✅ Paymob Order ID: ${paymobOrderId}`);

    const paymentKey = await this.generatePaymentKey(authToken, paymobOrderId, order);
    console.log(`✅ Payment Key: ${paymentKey.substring(0, 6)}...`);

    return {
        redirectUrl: `https://accept.paymob.com/api/acceptance/iframes/${this.IFRAME_ID}?payment_token=${paymentKey}`,
    };
}

  // Step 4: Handle Paymob Webhook
  async handleWebhook(data: any) {
    const { hmac, obj } = data;

    // Verify HMAC (security check)
    if (!this.verifyHMAC(hmac, obj)) {
      throw new InternalServerErrorException('Invalid HMAC signature');
    }

    const payment:any = await this.paymentRepo.findOne({
      where: { order: { id: obj.order.id } },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    // Update payment status
    payment.status = obj.success ? 'succeeded' : 'failed';
    await this.paymentRepo.save(payment);

    // Update order status
    payment.order.status = obj.success ? OrderStatus.PROCESSING : OrderStatus.CANCELED;
    await this.orderRepo.save(payment.order);
  }

  // HMAC Verification (for webhook security)
  private verifyHMAC(hmac: string, obj: any): boolean {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    const sortedKeys = Object.keys(obj).sort();
    const hashString = sortedKeys.map((key) => obj[key]).join('');
    const generatedHmac = require('crypto').createHmac('sha512', hmacSecret).update(hashString).digest('hex');
    return generatedHmac === hmac;
  }
}