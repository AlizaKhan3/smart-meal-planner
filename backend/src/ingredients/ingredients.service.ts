import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ingredient, IngredientDocument } from './schemas/ingredient.schema';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name) private model: Model<IngredientDocument>,
  ) {}

  findAll(search?: string) {
    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return this.model.find(filter).sort({ name: 1 }).limit(200);
  }

  findByNames(names: string[]) {
    return this.model.find({ name: { $in: names } });
  }
}
