import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  tiktokUrl?: string;

  @IsOptional()
  @IsString()
  twitterUrl?: string;

  // Home Features
  @IsOptional()
  @IsString()
  feature1Title?: string;

  @IsOptional()
  @IsString()
  feature1Description?: string;

  @IsOptional()
  @IsString()
  feature1Icon?: string;

  @IsOptional()
  @IsBoolean()
  feature1Enabled?: boolean;

  @IsOptional()
  @IsString()
  feature2Title?: string;

  @IsOptional()
  @IsString()
  feature2Description?: string;

  @IsOptional()
  @IsString()
  feature2Icon?: string;

  @IsOptional()
  @IsBoolean()
  feature2Enabled?: boolean;

  @IsOptional()
  @IsString()
  feature3Title?: string;

  @IsOptional()
  @IsString()
  feature3Description?: string;

  @IsOptional()
  @IsString()
  feature3Icon?: string;

  @IsOptional()
  @IsBoolean()
  feature3Enabled?: boolean;

  @IsOptional()
  @IsString()
  feature4Title?: string;

  @IsOptional()
  @IsString()
  feature4Description?: string;

  @IsOptional()
  @IsString()
  feature4Icon?: string;

  @IsOptional()
  @IsBoolean()
  feature4Enabled?: boolean;

  // Navbar Customization
  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(200)
  navbarLogoSize?: number;

  @IsOptional()
  @IsString()
  navbarText1?: string;

  @IsOptional()
  @IsString()
  navbarText2?: string;

  @IsOptional()
  @IsString()
  navbarText1Color?: string;

  @IsOptional()
  @IsString()
  navbarText2Color?: string;

  @IsOptional()
  @IsString()
  @IsIn(['sm', 'base', 'lg', 'xl', '2xl', '3xl'])
  navbarTextSize?: string;
}
