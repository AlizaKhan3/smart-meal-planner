import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MealPlanDocument = HydratedDocument<MealPlan>;

@Schema({ _id: false })
export class PlannedMeal {
  @Prop({ type: Types.ObjectId, ref: 'Meal', required: true })
  mealId: Types.ObjectId;

  @Prop({ enum: ['breakfast', 'lunch', 'dinner', 'snack'], default: 'lunch' })
  mealType: string;

  @Prop({ default: 1 }) servings: number;
}
const PlannedMealSchema = SchemaFactory.createForClass(PlannedMeal);

@Schema({ _id: false })
export class DailyTotals {
  @Prop({ default: 0 }) calories: number;
  @Prop({ default: 0 }) protein: number;
  @Prop({ default: 0 }) carbs: number;
  @Prop({ default: 0 }) fat: number;
}
const DailyTotalsSchema = SchemaFactory.createForClass(DailyTotals);

@Schema({ _id: false })
export class PlanDay {
  @Prop({ required: true }) date: string; // ISO yyyy-mm-dd
  @Prop({ type: [PlannedMealSchema], default: [] }) meals: PlannedMeal[];
  @Prop({ type: DailyTotalsSchema, default: {} }) dailyTotals: DailyTotals;
}
const PlanDaySchema = SchemaFactory.createForClass(PlanDay);

@Schema({ timestamps: true })
export class MealPlan {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true }) weekStartDate: string;

  @Prop({ type: [PlanDaySchema], default: [] })
  days: PlanDay[];

  @Prop({ enum: ['active', 'archived'], default: 'active' })
  status: string;
}

export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);
