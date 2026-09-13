import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroceryList, GroceryListDocument } from './schemas/grocery-list.schema';
import { MealPlan, MealPlanDocument } from '../meal-plans/schemas/meal-plan.schema';
import { Meal, MealDocument } from '../meals/schemas/meal.schema';
import { Ingredient, IngredientDocument } from '../ingredients/schemas/ingredient.schema';
import { AddGroceryItemDto, UpdateGroceryItemDto } from './dto/grocery.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectModel(GroceryList.name) private groceryModel: Model<GroceryListDocument>,
    @InjectModel(MealPlan.name) private planModel: Model<MealPlanDocument>,
    @InjectModel(Meal.name) private mealModel: Model<MealDocument>,
    @InjectModel(Ingredient.name) private ingredientModel: Model<IngredientDocument>,
  ) {}

  /**
   * Grocery aggregation — Section 14.3 of the spec.
   * Read plan meals → extract ingredients → normalise names & units →
   * combine duplicates → group by category.
   */
  async generate(userId: string, mealPlanId: string) {
    const plan = await this.planModel.findById(mealPlanId);
    if (!plan) throw new NotFoundException('Meal plan not found');
    if (plan.userId.toString() !== userId) throw new ForbiddenException();

    const mealIds = plan.days.flatMap((d) => d.meals.map((m) => m.mealId));
    const meals = await this.mealModel.find({ _id: { $in: mealIds } });
    const mealById = new Map(meals.map((m) => [m.id, m]));

    // categories lookup from the ingredient catalogue
    const catByName = new Map(
      (await this.ingredientModel.find()).map((i) => [i.name.toLowerCase(), i.category]),
    );

    // key = name|unit so we only combine compatible units
    const combined = new Map<string, { name: string; quantity: number; unit: string; category: string }>();

    for (const day of plan.days) {
      for (const pm of day.meals) {
        const meal = mealById.get(pm.mealId.toString());
        if (!meal) continue;
        const servings = pm.servings ?? 1;
        for (const ing of meal.ingredients) {
          const name = ing.name.trim();
          const unit = ing.unit || 'g';
          const key = `${name.toLowerCase()}|${unit}`;
          const category = catByName.get(name.toLowerCase()) ?? 'pantry';
          const qty = (ing.quantity || 0) * servings;
          if (combined.has(key)) {
            combined.get(key)!.quantity += qty;
          } else {
            combined.set(key, { name, quantity: qty, unit, category });
          }
        }
      }
    }

    const items = [...combined.values()]
      .map((i) => ({ ...i, quantity: Math.round(i.quantity), isPurchased: false }))
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

    // upsert one grocery list per plan
    const list = await this.groceryModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId), mealPlanId: new Types.ObjectId(mealPlanId) },
      { userId, mealPlanId, items },
      { new: true, upsert: true },
    );
    return list;
  }

  findAll(userId: string) {
    return this.groceryModel.find({ userId }).sort({ createdAt: -1 });
  }

  private async owned(userId: string, id: string) {
    const list = await this.groceryModel.findById(id);
    if (!list) throw new NotFoundException('Grocery list not found');
    if (list.userId.toString() !== userId) throw new ForbiddenException();
    return list;
  }

  async addItem(userId: string, id: string, dto: AddGroceryItemDto) {
    const list = await this.owned(userId, id);
    list.items.push({
      name: dto.name,
      quantity: dto.quantity ?? 1,
      unit: dto.unit ?? 'pcs',
      category: dto.category ?? 'pantry',
      isPurchased: false,
    } as any);
    await list.save();
    return list;
  }

  async updateItem(userId: string, id: string, itemId: string, dto: UpdateGroceryItemDto) {
    const list = await this.owned(userId, id);
    const item = list.items.id(itemId);
    if (!item) throw new NotFoundException('Item not found');
    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.isPurchased !== undefined) item.isPurchased = dto.isPurchased;
    await list.save();
    return list;
  }

  async removeItem(userId: string, id: string, itemId: string) {
    const list = await this.owned(userId, id);
    const item = list.items.id(itemId);
    if (!item) throw new NotFoundException('Item not found');
    item.deleteOne();
    await list.save();
    return list;
  }
}
