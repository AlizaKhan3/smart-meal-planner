export interface Nutrition {
  calories: number; protein: number; carbs: number; fat: number; fiber: number;
}
export interface MealIngredient {
  ingredientId?: string; name: string; quantity: number; unit: string;
}
export interface Meal {
  _id: string; name: string; mealType: string; servings: number;
  ingredients: MealIngredient[]; nutrition: Nutrition; tags: string[];
  instructions?: string; prepTimeMin: number; emoji: string;
}
export interface User {
  _id: string; name: string; email: string; sex: string; age: number;
  heightCm: number; weightKg: number; goal: string; activityLevel: string;
  dietType: string; allergies: string[]; dailyCalorieTarget: number;
  subscriptionPlan: 'free' | 'premium';
}
export interface GroceryItem {
  _id: string; name: string; quantity: number; unit: string;
  category: string; isPurchased: boolean;
}
export interface GroceryList {
  _id: string; userId: string; mealPlanId?: string; items: GroceryItem[];
}
export interface NutritionSummary {
  date: string; target: number; consumed: Nutrition; remaining: number;
  loggedMeals: { id: string; name: string; calories: number; servings: number }[];
}
