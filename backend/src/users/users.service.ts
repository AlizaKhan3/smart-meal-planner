import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, ActivityLevel } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal adjustment (kcal) applied to maintenance energy
const GOAL_ADJUST: Record<string, number> = {
  weight_loss: -400,
  maintenance: 0,
  muscle_gain: 300,
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Mifflin-St Jeor BMR × activity factor, adjusted by goal.
   * Result is an ESTIMATE and is editable by the user — never medical advice.
   */
  estimateCalorieTarget(user: Pick<User, 'sex' | 'weightKg' | 'heightCm' | 'age' | 'activityLevel' | 'goal'>) {
    const { sex, weightKg: w, heightCm: h, age: a, activityLevel, goal } = user;
    const bmr =
      sex === 'female'
        ? 10 * w + 6.25 * h - 5 * a - 161
        : 10 * w + 6.25 * h - 5 * a + 5;
    const maintenance = bmr * (ACTIVITY_FACTORS[activityLevel] ?? 1.55);
    const target = maintenance + (GOAL_ADJUST[goal] ?? 0);
    return Math.max(1200, Math.round(target / 10) * 10); // never below a safe floor
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);

    // Recompute the suggested target only when the user did not set one explicitly
    if (dto.dailyCalorieTarget === undefined) {
      user.dailyCalorieTarget = this.estimateCalorieTarget(user);
    }
    await user.save();
    const { passwordHash, ...safe } = user.toObject();
    return safe;
  }
}
