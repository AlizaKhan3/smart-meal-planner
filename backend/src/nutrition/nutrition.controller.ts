import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NutritionService } from './nutrition.service';
import { LogMealDto } from './dto/log-meal.dto';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private readonly service: NutritionService) {}

  @Get('summary')
  summary(@CurrentUser('userId') userId: string, @Query('date') date?: string) {
    return this.service.summary(userId, date);
  }

  @Post('log')
  log(@CurrentUser('userId') userId: string, @Body() dto: LogMealDto) {
    return this.service.log(userId, dto);
  }

  @Get('history')
  history(@CurrentUser('userId') userId: string, @Query('days') days?: string) {
    return this.service.history(userId, days ? parseInt(days, 10) : 7);
  }
}
