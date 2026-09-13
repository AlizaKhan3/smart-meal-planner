import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NutritionLogDocument = HydratedDocument<NutritionLog>;

@Schema({ timestamps: true })
export class NutritionLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Meal' })
  mealId: Types.ObjectId;

  @Prop({ required: true, index: true }) date: string; // yyyy-mm-dd

  @Prop({ default: '' }) mealName: string;
  @Prop({ default: 1 }) servings: number;

  @Prop({ default: 0 }) calories: number;
  @Prop({ default: 0 }) protein: number;
  @Prop({ default: 0 }) carbs: number;
  @Prop({ default: 0 }) fat: number;
  @Prop({ default: 0 }) fiber: number;
}

export const NutritionLogSchema = SchemaFactory.createForClass(NutritionLog);
