import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';

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
      const slug = slugify(createProductDto.name, { lower: true, strict: true });
      
      // Verificar si el slug ya existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (existingProduct) {
        throw new BadRequestException(`Product with name "${createProductDto.name}" already exists (slug conflict)`);
      }

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          slug,
        },
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

  async findOne(term: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { id: term },
          { slug: term },
        ],
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with term "${term}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { name } = updateProductDto;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = { ...updateProductDto };

    if (name) {
      data.slug = slugify(name, { lower: true, strict: true });
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
