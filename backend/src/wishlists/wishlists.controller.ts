import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AddWishlistItemDto } from './dto/add-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser {
  user: {
    userId: string;
  };
}

@ApiTags('Wishlists')
@ApiBearerAuth()
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user.userId, createWishlistDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.wishlistsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.wishlistsService.findOne(req.user.userId, id);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.wishlistsService.remove(req.user.userId, id);
  }

  @Post(':id/items')
  addItem(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() addWishlistItemDto: AddWishlistItemDto,
  ) {
    return this.wishlistsService.addItem(
      req.user.userId,
      id,
      addWishlistItemDto.productId,
    );
  }

  @Delete(':id/items/:productId')
  removeItem(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistsService.removeItem(req.user.userId, id, productId);
  }
}
