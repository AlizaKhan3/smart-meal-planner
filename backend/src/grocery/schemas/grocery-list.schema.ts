import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GroceryListDocument = HydratedDocument<GroceryList>;

@Schema()
export class GroceryItem {
  @Prop({ required: true }) name: string;
  @Prop({ default: 0 }) quantity: number;
  @Prop({ default: 'g' }) unit: string;
  @Prop({ default: 'pantry' }) category: string;
  @Prop({ default: false }) isPurchased: boolean;
}
const GroceryItemSchema = SchemaFactory.createForClass(GroceryItem);

@Schema({ timestamps: true })
export class GroceryList {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'MealPlan' })
  mealPlanId: Types.ObjectId;

  @Prop({ type: [GroceryItemSchema], default: [] })
  items: Types.DocumentArray<GroceryItem>;
}

export const GroceryListSchema = SchemaFactory.createForClass(GroceryList);
