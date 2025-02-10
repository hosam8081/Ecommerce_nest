import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { User } from 'src/auth/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getCart(user) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: { user: true, items: true },
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }
    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return { ...cart, totalPrice };
  }

  async addToCart(createCartDto: AddToCartDto) {

    const product = await this.productRepository.findOne({ where: { id: createCartDto.product_id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: createCartDto.cartId },
        product,
      },
      relations: ['cart', 'product'],
    });

    if (!cartItem) {
      cartItem = this.cartItemRepository.create({
        product: { id: createCartDto.product_id },
        cart: { id: createCartDto.cartId },
        quantity: createCartDto.quantity,
        price: product.price
      });
    } else {
      cartItem.quantity += createCartDto.quantity;
      cartItem.price = product.price
    }
    await this.cartItemRepository.save(cartItem);

    return cartItem;
  }

  async update(product_id: number, updateCartDto, user: User) {
    let cartItem = await this.cartItemRepository.findOne({where: {product: {id: product_id}, cart: { user: {id: user.id}}}})
    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }
    cartItem.quantity += updateCartDto.quantity;
    await this.cartItemRepository.save(cartItem);
    return this.getCart(user);
  }

  async remove(product_id: number, user: User) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart: { user: { id: user.id } }, product: { id: product_id } },
    });
    if (!cartItem) {
      throw new HttpException(
        'Product item not found in Cart',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.cartItemRepository.remove(cartItem);

    return this.getCart(user);
  }

  async clear(user: User) {
    const cartItem = await this.cartItemRepository.find({
      where: { cart: { user: { id: user.id } } },
    });
    await this.cartItemRepository.remove(cartItem);

    return this.getCart(user);
  }
}
