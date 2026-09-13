import { PartialType } from '@nestjs/mapped-types';
import { CreateMealDto } from './create-meal.dto';
// PartialType from @nestjs/mapped-types keeps validators optional.
export class UpdateMealDto extends PartialType(CreateMealDto) {}
