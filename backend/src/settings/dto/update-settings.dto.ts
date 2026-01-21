import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  phoneCountryCode?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  freeShippingEnabled?: boolean;

  @IsOptional()
  @IsString()
  freeShippingBannerText?: string;

  @IsOptional()
  @IsString()
  freeShippingEmoji?: string;

  @IsOptional()
  @IsBoolean()
  customBannerEnabled?: boolean;

  @IsOptional()
  @IsString()
  customBannerText?: string;

  @IsOptional()
  @IsString()
  customBannerLink?: string;

  @IsOptional()
  @IsString()
  customBannerBgColor?: string;

  @IsOptional()
  @IsString()
  customBannerTextColor?: string;

  @IsOptional()
  @IsBoolean()
  customBannerIsAnimated?: boolean;
}
