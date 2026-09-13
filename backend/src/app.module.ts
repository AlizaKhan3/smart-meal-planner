import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { MealPlansModule } from './meal-plans/meal-plans.module';
import { GroceryModule } from './grocery/grocery.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    UsersModule,
    MealsModule,
    IngredientsModule,
    NutritionModule,
    MealPlansModule,
    GroceryModule,
    SubscriptionsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
