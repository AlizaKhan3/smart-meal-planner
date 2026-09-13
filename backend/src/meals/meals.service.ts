import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Meal, MealDocument } from './schemas/meal.schema';
import { CreateMealDto, MealIngredientDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(Meal.name) private mealModel: Model<MealDocument>,
    private readonly ingredientsService: IngredientsService,
  ) {}

  /**
   * Core business logic — Section 14.1 of the spec.
   * Nutrient Total = Σ (Ingredient Quantity ÷ 100 × Nutrient per 100g)
   */
  async computeNutrition(ingredients: MealIngredientDto[]) {
    const names = ingredients.map((i) => i.name);
    const db = await this.ingredientsService.findByNames(names);
    const byName = new Map(db.map((d) => [d.name.toLowerCase(), d.nutritionPer100g]));

    const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    for (const ing of ingredients) {
      const per100 = byName.get(ing.name.toLowerCase());
      if (!per100) continue; // gracefully skip ingredients missing nutrition data
      const factor = (ing.quantity || 0) / 100;
      total.calories += per100.calories * factor;
      total.protein += per100.protein * factor;
      total.carbs += per100.carbs * factor;
      total.fat += per100.fat * factor;
      total.fiber += per100.fiber * factor;
    }
    // round to whole numbers for display
    return Object.fromEntries(
      Object.entries(total).map(([k, v]) => [k, Math.round(v)]),
    ) as typeof total;
  }

  async create(userId: string, dto: CreateMealDto) {
    const nutrition = await this.computeNutrition(dto.ingredients);
    return this.mealModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      nutrition,
    });
  }

  findAll(userId: string) {
    return this.mealModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findOne(userId: string, id: string) {
    const meal = await this.mealModel.findById(id);
    if (!meal) throw new NotFoundException('Meal not found');
    if (meal.userId.toString() !== userId) throw new ForbiddenException();
    return meal;
  }

  async update(userId: string, id: string, dto: UpdateMealDto) {
    const meal = await this.findOne(userId, id);
    Object.assign(meal, dto);
    if (dto.ingredients) {
      meal.nutrition = await this.computeNutrition(dto.ingredients) as any;
    }
    await meal.save();
    return meal;
  }

  async remove(userId: string, id: string) {
    const meal = await this.findOne(userId, id);
    await meal.deleteOne();
    return { deleted: true };
  }
}
