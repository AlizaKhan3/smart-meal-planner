import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MealPlan, MealPlanDocument } from './schemas/meal-plan.schema';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { Meal, MealDocument } from '../meals/schemas/meal.schema';

@Injectable()
export class MealPlansService {
  constructor(
    @InjectModel(MealPlan.name) private planModel: Model<MealPlanDocument>,
    @InjectModel(Meal.name) private mealModel: Model<MealDocument>,
  ) {}

  /** Sum each day's meal nutrition into dailyTotals. */
  private async withDailyTotals(days: CreateMealPlanDto['days']) {
    const allIds = days.flatMap((d) => d.meals.map((m) => m.mealId));
    const meals = await this.mealModel.find({ _id: { $in: allIds } });
    const byId = new Map(meals.map((m) => [m.id, m]));

    return days.map((day) => {
      const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      for (const pm of day.meals) {
        const meal = byId.get(pm.mealId);
        if (!meal) continue;
        const s = pm.servings ?? 1;
        totals.calories += meal.nutrition.calories * s;
        totals.protein += meal.nutrition.protein * s;
        totals.carbs += meal.nutrition.carbs * s;
        totals.fat += meal.nutrition.fat * s;
      }
      return {
        date: day.date,
        meals: day.meals.map((m) => ({
          mealId: new Types.ObjectId(m.mealId),
          mealType: m.mealType ?? 'lunch',
          servings: m.servings ?? 1,
        })),
        dailyTotals: Object.fromEntries(
          Object.entries(totals).map(([k, v]) => [k, Math.round(v)]),
        ),
      };
    });
  }

  async create(userId: string, dto: CreateMealPlanDto) {
    const days = await this.withDailyTotals(dto.days);
    return this.planModel.create({
      userId: new Types.ObjectId(userId),
      weekStartDate: dto.weekStartDate,
      days,
    });
  }

  findAll(userId: string) {
    return this.planModel.find({ userId }).sort({ weekStartDate: -1 });
  }

  async findOne(userId: string, id: string) {
    const plan = await this.planModel
      .findById(id)
      .populate('days.meals.mealId');
    if (!plan) throw new NotFoundException('Meal plan not found');
    if (plan.userId.toString() !== userId) throw new ForbiddenException();
    return plan;
  }

  async update(userId: string, id: string, dto: CreateMealPlanDto) {
    const plan = await this.findOne(userId, id);
    plan.weekStartDate = dto.weekStartDate;
    plan.days = (await this.withDailyTotals(dto.days)) as any;
    await plan.save();
    return plan;
  }

  async remove(userId: string, id: string) {
    const plan = await this.findOne(userId, id);
    await plan.deleteOne();
    return { deleted: true };
  }
}
