import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NutritionLog, NutritionLogSchema } from './schemas/nutrition-log.schema';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';
import { MealsModule } from '../meals/meals.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NutritionLog.name, schema: NutritionLogSchema }]),
    MealsModule,
    UsersModule,
  ],
  controllers: [NutritionController],
  providers: [NutritionService],
})
export class NutritionModule {}
