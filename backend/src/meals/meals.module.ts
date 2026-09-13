import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './schemas/meal.schema';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    IngredientsModule,
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService, MongooseModule],
})
export class MealsModule {}
