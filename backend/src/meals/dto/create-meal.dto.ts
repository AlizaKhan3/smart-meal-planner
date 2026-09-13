import { Type } from 'class-transformer';
import {
  IsArray, IsIn, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested,
} from 'class-validator';

export class MealIngredientDto {
  @IsOptional() @IsString() ingredientId?: string;
  @IsString() name: string;
  @IsNumber() @Min(0) quantity: number;
  @IsOptional() @IsString() unit?: string;
}

export class CreateMealDto {
  @IsString() name: string;

  @IsOptional() @IsIn(['breakfast', 'lunch', 'dinner', 'snack'])
  mealType?: string;

  @IsOptional() @IsInt() @Min(1) servings?: number;

  @IsArray() @ValidateNested({ each: true }) @Type(() => MealIngredientDto)
  ingredients: MealIngredientDto[];

  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsInt() @Min(0) prepTimeMin?: number;
  @IsOptional() @IsString() emoji?: string;
}
