import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof UserEntity,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { 
        username: loginDto.username,
        // not enoght payment for security
        password: loginDto.password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}