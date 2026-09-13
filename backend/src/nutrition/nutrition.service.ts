import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NutritionLog, NutritionLogDocument } from './schemas/nutrition-log.schema';
import { Meal, MealDocument } from '../meals/schemas/meal.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LogMealDto } from './dto/log-meal.dto';

const today = () => new Date().toISOString().slice(0, 10);

@Injectable()
export class NutritionService {
  constructor(
    @InjectModel(NutritionLog.name) private logModel: Model<NutritionLogDocument>,
    @InjectModel(Meal.name) private mealModel: Model<MealDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async log(userId: string, dto: LogMealDto) {
    const meal = await this.mealModel.findById(dto.mealId);
    if (!meal) throw new NotFoundException('Meal not found');
    const s = dto.servings ?? 1;
    return this.logModel.create({
      userId: new Types.ObjectId(userId),
      mealId: meal._id,
      date: dto.date ?? today(),
      mealName: meal.name,
      servings: s,
      calories: meal.nutrition.calories * s,
      protein: meal.nutrition.protein * s,
      carbs: meal.nutrition.carbs * s,
      fat: meal.nutrition.fat * s,
      fiber: meal.nutrition.fiber * s,
    });
  }

  /** Daily summary: consumed vs target and remaining. */
  async summary(userId: string, date = today()) {
    const logs = await this.logModel.find({ userId, date });
    const consumed = logs.reduce(
      (acc, l) => ({
        calories: acc.calories + l.calories,
        protein: acc.protein + l.protein,
        carbs: acc.carbs + l.carbs,
        fat: acc.fat + l.fat,
        fiber: acc.fiber + l.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    );
    const user = await this.userModel.findById(userId);
    const target = user?.dailyCalorieTarget ?? 2000;
    return {
      date,
      target,
      consumed: Object.fromEntries(
        Object.entries(consumed).map(([k, v]) => [k, Math.round(v)]),
      ),
      remaining: Math.max(0, Math.round(target - consumed.calories)),
      loggedMeals: logs.map((l) => ({
        id: l.id, name: l.mealName, calories: Math.round(l.calories), servings: l.servings,
      })),
    };
  }

  /** Last N days of totals for history charts. */
  async history(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    const sinceStr = since.toISOString().slice(0, 10);

    const rows = await this.logModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), date: { $gte: sinceStr } } },
      {
        $group: {
          _id: '$date',
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          carbs: { $sum: '$carbs' },
          fat: { $sum: '$fat' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return rows.map((r) => ({
      date: r._id,
      calories: Math.round(r.calories),
      protein: Math.round(r.protein),
      carbs: Math.round(r.carbs),
      fat: Math.round(r.fat),
    }));
  }
}
