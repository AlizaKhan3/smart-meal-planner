/**
 * Seed script — populates the ingredient catalogue (with nutrition per 100g)
 * and a set of demo meals for a demo user.
 *
 *   npm run seed
 */
import 'reflect-metadata';
import { connect, disconnect, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserSchema } from '../users/schemas/user.schema';
import { IngredientSchema } from '../ingredients/schemas/ingredient.schema';
import { MealSchema } from '../meals/schemas/meal.schema';

dotenv.config();

const INGREDIENTS = [
  // name, category, {cal,protein,carbs,fat,fiber} per 100g
  ['Sourdough bread', 'grains', { calories: 289, protein: 12, carbs: 56, fat: 1.9, fiber: 3 }],
  ['Avocado', 'fruits', { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 }],
  ['Free-range egg', 'protein', { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 }],
  ['Cherry tomatoes', 'vegetables', { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }],
  ['Olive oil', 'pantry', { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }],
  ['Quinoa', 'grains', { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 }],
  ['Roasted chickpeas', 'protein', { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 }],
  ['Sweet potato', 'vegetables', { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 }],
  ['Kale', 'vegetables', { calories: 49, protein: 4.3, carbs: 9, fat: 0.9, fiber: 3.6 }],
  ['Tahini', 'pantry', { calories: 595, protein: 17, carbs: 21, fat: 54, fiber: 9.3 }],
  ['Spinach', 'vegetables', { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 }],
  ['Mushrooms', 'vegetables', { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 }],
  ['Feta', 'dairy', { calories: 264, protein: 14, carbs: 4, fat: 21, fiber: 0 }],
  ['Salmon fillet', 'meat', { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 }],
  ['Asparagus', 'vegetables', { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1 }],
  ['New potatoes', 'vegetables', { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 }],
  ['Rolled oats', 'grains', { calories: 389, protein: 17, carbs: 66, fat: 6.9, fiber: 10.6 }],
  ['Greek yogurt', 'dairy', { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0 }],
  ['Mixed berries', 'fruits', { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 }],
  ['Chia seeds', 'pantry', { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 }],
  ['Honey', 'pantry', { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 }],
  ['Brown rice', 'grains', { calories: 123, protein: 2.7, carbs: 26, fat: 1, fiber: 1.6 }],
  ['Edamame', 'protein', { calories: 121, protein: 12, carbs: 9, fat: 5, fiber: 5 }],
  ['Red cabbage', 'vegetables', { calories: 31, protein: 1.4, carbs: 7, fat: 0.2, fiber: 2.1 }],
  ['Carrot', 'vegetables', { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 }],
  ['Penne pasta', 'grains', { calories: 157, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8 }],
  ['Passata', 'pantry', { calories: 35, protein: 1.6, carbs: 6.6, fat: 0.3, fiber: 1.5 }],
  ['Cream cheese', 'dairy', { calories: 342, protein: 6, carbs: 4, fat: 34, fiber: 0 }],
  ['Parmesan', 'dairy', { calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0 }],
  ['Chickpeas', 'protein', { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 }],
  ['Coconut milk', 'pantry', { calories: 230, protein: 2.3, carbs: 5.5, fat: 24, fiber: 2.2 }],
  ['Basmati rice', 'grains', { calories: 121, protein: 2.7, carbs: 25, fat: 0.4, fiber: 0.5 }],
  ['Curry paste', 'pantry', { calories: 150, protein: 3, carbs: 12, fat: 10, fiber: 3 }],
  ['Banana', 'fruits', { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 }],
  ['Pea protein', 'protein', { calories: 360, protein: 80, carbs: 7, fat: 6, fiber: 6 }],
  ['Almond milk', 'dairy', { calories: 17, protein: 0.6, carbs: 0.6, fat: 1.2, fiber: 0.2 }],
  ['Frozen mango', 'fruits', { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 }],
  ['Firm tofu', 'protein', { calories: 144, protein: 17, carbs: 3, fat: 9, fiber: 2 }],
  ['Broccoli', 'vegetables', { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 }],
  ['Bell pepper', 'vegetables', { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 }],
  ['Rice noodles', 'grains', { calories: 108, protein: 1.8, carbs: 25, fat: 0.2, fiber: 1 }],
  ['Soy-ginger sauce', 'pantry', { calories: 90, protein: 3, carbs: 15, fat: 1, fiber: 0.5 }],
  ['Basil', 'vegetables', { calories: 23, protein: 3.2, carbs: 2.7, fat: 0.6, fiber: 1.6 }],
  ['Lemon', 'fruits', { calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8 }],
  ['Butter', 'dairy', { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 }],
] as const;

const MEALS = [
  { name: 'Avocado Toast with Fried Egg', mealType: 'breakfast', emoji: '🥑', prepTimeMin: 15, tags: ['high-protein', 'healthy'],
    ingredients: [['Sourdough bread', 60], ['Avocado', 100], ['Free-range egg', 55], ['Cherry tomatoes', 60], ['Olive oil', 5]] },
  { name: 'Quinoa Bowl with Vegetables', mealType: 'lunch', emoji: '🥗', prepTimeMin: 25, tags: ['vegan', 'high-fibre'],
    ingredients: [['Quinoa', 150], ['Roasted chickpeas', 80], ['Sweet potato', 120], ['Kale', 50], ['Tahini', 30]] },
  { name: 'Seared Salmon & Greens', mealType: 'dinner', emoji: '🍣', prepTimeMin: 22, tags: ['omega-3', 'low-carb'],
    ingredients: [['Salmon fillet', 160], ['Asparagus', 90], ['New potatoes', 120], ['Lemon', 30], ['Olive oil', 10]] },
  { name: 'Berry Overnight Oats', mealType: 'breakfast', emoji: '🥣', prepTimeMin: 5, tags: ['make-ahead', 'high-fibre'],
    ingredients: [['Rolled oats', 60], ['Greek yogurt', 120], ['Mixed berries', 80], ['Chia seeds', 15], ['Honey', 7]] },
  { name: 'Rainbow Buddha Bowl', mealType: 'lunch', emoji: '🌈', prepTimeMin: 20, tags: ['vegan', 'healthy'],
    ingredients: [['Brown rice', 120], ['Edamame', 70], ['Red cabbage', 50], ['Carrot', 60], ['Tahini', 30]] },
  { name: 'Creamy Tomato Pasta', mealType: 'dinner', emoji: '🍝', prepTimeMin: 18, tags: ['comfort', 'vegetarian'],
    ingredients: [['Penne pasta', 120], ['Passata', 150], ['Cream cheese', 40], ['Basil', 10], ['Parmesan', 20]] },
  { name: 'Chickpea Coconut Curry', mealType: 'dinner', emoji: '🍛', prepTimeMin: 28, tags: ['vegan', 'warming'],
    ingredients: [['Chickpeas', 200], ['Coconut milk', 150], ['Spinach', 60], ['Basmati rice', 100], ['Curry paste', 30]] },
  { name: 'Green Protein Smoothie', mealType: 'breakfast', emoji: '🥤', prepTimeMin: 5, tags: ['quick', 'high-protein'],
    ingredients: [['Banana', 120], ['Spinach', 40], ['Pea protein', 30], ['Almond milk', 250], ['Frozen mango', 60]] },
  { name: 'Tofu Veg Stir-Fry', mealType: 'lunch', emoji: '🥡', prepTimeMin: 16, tags: ['vegan', 'low-fat'],
    ingredients: [['Firm tofu', 150], ['Broccoli', 90], ['Bell pepper', 70], ['Rice noodles', 100], ['Soy-ginger sauce', 30]] },
];

function computeNutrition(items: [string, number][], catalogue: Map<string, any>) {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const [name, qty] of items) {
    const n = catalogue.get(name.toLowerCase());
    if (!n) continue;
    const f = qty / 100;
    total.calories += n.calories * f;
    total.protein += n.protein * f;
    total.carbs += n.carbs * f;
    total.fat += n.fat * f;
    total.fiber += n.fiber * f;
  }
  return Object.fromEntries(Object.entries(total).map(([k, v]) => [k, Math.round(v)]));
}

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-meal-planner';
  await connect(uri);
  console.log('Connected to', uri);

  const Ingredient = model('Ingredient', IngredientSchema);
  const Meal = model('Meal', MealSchema);
  const User = model('User', UserSchema);

  await Ingredient.deleteMany({});
  await Ingredient.insertMany(
    INGREDIENTS.map(([name, category, nutritionPer100g]) => ({
      name, category, servingUnit: 'g', nutritionPer100g,
    })),
  );
  console.log(`Seeded ${INGREDIENTS.length} ingredients`);

  const catalogue = new Map(
    INGREDIENTS.map(([name, , n]) => [(name as string).toLowerCase(), n]),
  );

  // demo user
  let demo = await User.findOne({ email: 'demo@nourishplan.app' });
  if (!demo) {
    demo = await User.create({
      name: 'Luke Harrison',
      email: 'demo@nourishplan.app',
      passwordHash: await bcrypt.hash('password123', 10),
      sex: 'male', age: 28, heightCm: 178, weightKg: 76,
      goal: 'weight_loss', activityLevel: 'moderate',
      dietType: 'vegetarian', allergies: ['peanuts'],
      dailyCalorieTarget: 1800, subscriptionPlan: 'premium',
    });
    console.log('Created demo user → demo@nourishplan.app / password123');
  }

  await Meal.deleteMany({ userId: demo._id });
  await Meal.insertMany(
    MEALS.map((m) => ({
      userId: demo!._id,
      name: m.name,
      mealType: m.mealType,
      emoji: m.emoji,
      prepTimeMin: m.prepTimeMin,
      tags: m.tags,
      servings: 1,
      ingredients: m.ingredients.map(([name, quantity]) => ({ name, quantity, unit: 'g' })),
      nutrition: computeNutrition(m.ingredients as [string, number][], catalogue),
    })),
  );
  console.log(`Seeded ${MEALS.length} demo meals`);

  await disconnect();
  console.log('✅ Seed complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
