import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
@UseGuards(JwtAuthGuard)
export class IngredientsController {
  constructor(private readonly service: IngredientsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }
}
