import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IsIn } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserDocument } from '../users/schemas/user.schema';

class ChangePlanDto {
  @IsIn(['free', 'premium']) plan: 'free' | 'premium';
}

const FEATURES = {
  free: {
    maxMeals: 15, maxPlans: 2, analytics: 'basic',
    groceryExport: false, aiMealGeneration: false, historyDays: 7,
  },
  premium: {
    maxMeals: Infinity, maxPlans: Infinity, analytics: 'advanced',
    groceryExport: true, aiMealGeneration: 'coming_soon', historyDays: 365,
  },
};

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get('me')
  async me(@CurrentUser('userId') userId: string) {
    const user = await this.userModel.findById(userId);
    const plan = user?.subscriptionPlan ?? 'free';
    return { plan, features: FEATURES[plan] };
  }

  // In the MVP the plan is simulated via a field on the user document.
  @Patch('me')
  async change(@CurrentUser('userId') userId: string, @Body() dto: ChangePlanDto) {
    await this.userModel.findByIdAndUpdate(userId, { subscriptionPlan: dto.plan });
    return { plan: dto.plan, features: FEATURES[dto.plan] };
  }
}
