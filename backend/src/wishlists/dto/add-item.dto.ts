import { IsString, IsNotEmpty } from 'class-validator';

export class AddWishlistItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
