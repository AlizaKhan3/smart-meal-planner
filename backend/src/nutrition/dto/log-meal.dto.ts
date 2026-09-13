import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class LogMealDto {
  @IsString() mealId: string;
  @IsOptional() @IsString() date?: string; // defaults to today
  @IsOptional() @IsInt() @Min(1) servings?: number;
}
