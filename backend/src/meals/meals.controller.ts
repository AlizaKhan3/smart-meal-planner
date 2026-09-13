import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly service: MealsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateMealDto) {
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
    @Body() dto: UpdateMealDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.service.remove(userId, id);
  }
}
