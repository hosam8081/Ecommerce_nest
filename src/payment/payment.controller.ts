import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log("✅ body", body)
    console.log('✅ Webhook received:', body);

    return await this.paymentService.handleWebhook(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  async initiatePayment(@Param('orderId') orderId: number) {
    return this.paymentService.createPayment(orderId);
  }

}