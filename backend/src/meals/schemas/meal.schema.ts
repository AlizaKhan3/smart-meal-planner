import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MealDocument = HydratedDocument<Meal>;
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

@Schema({ _id: false })
export class MealIngredient {
  @Prop({ type: Types.ObjectId, ref: 'Ingredient' })
  ingredientId?: Types.ObjectId;

  @Prop({ required: true }) name: string;
  @Prop({ required: true }) quantity: number;
  @Prop({ default: 'g' }) unit: string;
}
const MealIngredientSchema = SchemaFactory.createForClass(MealIngredient);

@Schema({ _id: false })
export class Nutrition {
  @Prop({ default: 0 }) calories: number;
  @Prop({ default: 0 }) protein: number;
  @Prop({ default: 0 }) carbs: number;
  @Prop({ default: 0 }) fat: number;
  @Prop({ default: 0 }) fiber: number;
}
const NutritionSchema = SchemaFactory.createForClass(Nutrition);

@Schema({ timestamps: true })
export class Meal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true }) name: string;

  @Prop({ enum: ['breakfast', 'lunch', 'dinner', 'snack'], default: 'lunch' })
  mealType: MealType;

  @Prop({ default: 1 }) servings: number;

  @Prop({ type: [MealIngredientSchema], default: [] })
  ingredients: MealIngredient[];

  @Prop({ type: NutritionSchema, default: {} })
  nutrition: Nutrition;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' }) instructions: string;

  @Prop({ default: 0 }) prepTimeMin: number;

  @Prop({ default: '🍽️' }) emoji: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
