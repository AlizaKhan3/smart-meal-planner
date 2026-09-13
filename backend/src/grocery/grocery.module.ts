import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroceryList, GroceryListSchema } from './schemas/grocery-list.schema';
import { GroceryService } from './grocery.service';
import { GroceryController } from './grocery.controller';
import { MealPlansModule } from '../meal-plans/meal-plans.module';
import { MealsModule } from '../meals/meals.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroceryList.name, schema: GroceryListSchema }]),
    MealPlansModule,
    MealsModule,
    IngredientsModule,
  ],
  controllers: [GroceryController],
  providers: [GroceryService],
})
export class GroceryModule {}
