import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccess(userId: string) {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });
  }

  generateRefresh(userId: string) {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
  }

  generateTokens(userId: string) {
    return {
      accessToken: this.jwtService.sign({ sub: userId }, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ sub: userId }, { expiresIn: '7d' }),
    };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
