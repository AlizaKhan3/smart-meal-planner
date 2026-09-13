import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IngredientDocument = HydratedDocument<Ingredient>;

export type Category =
  | 'vegetables' | 'fruits' | 'grains' | 'dairy'
  | 'meat' | 'protein' | 'pantry';

@Schema({ _id: false })
export class NutritionPer100g {
  @Prop({ default: 0 }) calories: number;
  @Prop({ default: 0 }) protein: number;
  @Prop({ default: 0 }) carbs: number;
  @Prop({ default: 0 }) fat: number;
  @Prop({ default: 0 }) fiber: number;
}
const NutritionSchema = SchemaFactory.createForClass(NutritionPer100g);

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @Prop({
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'protein', 'pantry'],
    default: 'pantry',
  })
  category: Category;

  @Prop({ default: 'g' })
  servingUnit: string;

  @Prop({ type: NutritionSchema, default: {} })
  nutritionPer100g: NutritionPer100g;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
