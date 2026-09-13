import {
  IsArray, IsIn, IsInt, IsOptional, IsString, Max, Min,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsIn(['male', 'female']) sex?: string;
  @IsOptional() @IsInt() @Min(10) @Max(100) age?: number;
  @IsOptional() @IsInt() @Min(80) @Max(250) heightCm?: number;
  @IsOptional() @IsInt() @Min(30) @Max(300) weightKg?: number;
  @IsOptional() @IsIn(['weight_loss', 'maintenance', 'muscle_gain']) goal?: string;
  @IsOptional()
  @IsIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
  activityLevel?: string;
  @IsOptional()
  @IsIn(['vegetarian', 'vegan', 'non_vegetarian', 'high_protein', 'keto'])
  dietType?: string;
  @IsOptional() @IsArray() allergies?: string[];
  @IsOptional() @IsInt() @Min(1000) @Max(5000) dailyCalorieTarget?: number;
}
