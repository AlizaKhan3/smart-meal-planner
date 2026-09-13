import { Type } from 'class-transformer';
import {
  IsArray, IsOptional, IsString, ValidateNested, IsInt, Min,
} from 'class-validator';

class PlannedMealDto {
  @IsString() mealId: string;
  @IsOptional() @IsString() mealType?: string;
  @IsOptional() @IsInt() @Min(1) servings?: number;
}
class PlanDayDto {
  @IsString() date: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PlannedMealDto)
  meals: PlannedMealDto[];
}
export class CreateMealPlanDto {
  @IsString() weekStartDate: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => PlanDayDto)
  days: PlanDayDto[];
}
