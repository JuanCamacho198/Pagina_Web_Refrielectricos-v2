import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto, userId?: string) {
    return this.prisma.question.create({
      data: {
        content: createQuestionDto.content,
        productId: createQuestionDto.productId,
        userId: userId || null,
        guestName: createQuestionDto.guestName,
        guestEmail: createQuestionDto.guestEmail,
      },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.question.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.question.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image_url: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
