import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GroceryService } from './grocery.service';
import { AddGroceryItemDto, GenerateGroceryDto, UpdateGroceryItemDto } from './dto/grocery.dto';

@Controller('grocery')
@UseGuards(JwtAuthGuard)
export class GroceryController {
  constructor(private readonly service: GroceryService) {}

  @Post('generate')
  generate(@CurrentUser('userId') userId: string, @Body() dto: GenerateGroceryDto) {
    return this.service.generate(userId, dto.mealPlanId);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.service.findAll(userId);
  }

  @Post(':id/items')
  addItem(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: AddGroceryItemDto,
  ) {
    return this.service.addItem(userId, id, dto);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateGroceryItemDto,
  ) {
    return this.service.updateItem(userId, id, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.service.removeItem(userId, id, itemId);
  }
}
