import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GenerateGroceryDto {
  @IsString() mealPlanId: string;
}

export class AddGroceryItemDto {
  @IsString() name: string;
  @IsOptional() @IsNumber() @Min(0) quantity?: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsString() category?: string;
}

export class UpdateGroceryItemDto {
  @IsOptional() @IsNumber() @Min(0) quantity?: number;
  @IsOptional() @IsBoolean() isPurchased?: boolean;
}
