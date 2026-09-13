import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type Goal = 'weight_loss' | 'maintenance' | 'muscle_gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietType = 'vegetarian' | 'vegan' | 'non_vegetarian' | 'high_protein' | 'keto';
export type Plan = 'free' | 'premium';
export type Sex = 'male' | 'female';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  sex: Sex;

  @Prop({ default: 25 })
  age: number;

  @Prop({ default: 170 })
  heightCm: number;

  @Prop({ default: 70 })
  weightKg: number;

  @Prop({ enum: ['weight_loss', 'maintenance', 'muscle_gain'], default: 'maintenance' })
  goal: Goal;

  @Prop({
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  })
  activityLevel: ActivityLevel;

  @Prop({
    enum: ['vegetarian', 'vegan', 'non_vegetarian', 'high_protein', 'keto'],
    default: 'non_vegetarian',
  })
  dietType: DietType;

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ default: 2000 })
  dailyCalorieTarget: number;

  @Prop({ enum: ['free', 'premium'], default: 'free' })
  subscriptionPlan: Plan;
}

export const UserSchema = SchemaFactory.createForClass(User);
