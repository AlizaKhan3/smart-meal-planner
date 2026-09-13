import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private sign(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }

  private safeUser(user: any) {
    const obj = user.toObject ? user.toObject() : user;
    const { passwordHash, ...rest } = obj;
    return rest;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('An account with that email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
    });

    return {
      accessToken: this.sign(user.id, user.email),
      user: this.safeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return {
      accessToken: this.sign(user.id, user.email),
      user: this.safeUser(user),
    };
  }
}
