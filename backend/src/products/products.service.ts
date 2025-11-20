import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {
    if (!this.prisma) {
      console.error('ProductsService: PrismaService is not initialized!');
    }
  }

  async create(createProductDto: CreateProductDto) {
    console.log('ProductsService: Creating product in DB:', createProductDto);
    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
      });
      console.log('ProductsService: Product created successfully:', product.id);
      return product;
    } catch (error) {
      console.error('ProductsService: Error creating product in Prisma:', error);
      throw error;
    }
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
