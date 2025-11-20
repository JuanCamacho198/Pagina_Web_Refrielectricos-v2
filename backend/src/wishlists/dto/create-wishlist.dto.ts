import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
