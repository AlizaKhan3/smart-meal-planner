import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealPlan, MealPlanSchema } from './schemas/meal-plan.schema';
import { MealPlansService } from './meal-plans.service';
import { MealPlansController } from './meal-plans.controller';
import { MealsModule } from '../meals/meals.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MealPlan.name, schema: MealPlanSchema }]),
    MealsModule,
  ],
  controllers: [MealPlansController],
  providers: [MealPlansService],
  exports: [MealPlansService, MongooseModule],
})
export class MealPlansModule {}
