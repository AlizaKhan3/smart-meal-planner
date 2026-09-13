import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MealPlansService } from './meal-plans.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';

@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
export class MealPlansController {
  constructor(private readonly service: MealPlansService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateMealPlanDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.service.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: CreateMealPlanDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.service.remove(userId, id);
  }
}
