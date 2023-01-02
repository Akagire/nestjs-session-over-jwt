import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstraints } from './constraints';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstraints.secret,
    });
  }

  async validate(payload: any) {
    const sessionId = payload.session_id as string;
    // NOTE: When return falsy value it means invalid auth strategy.
    if (!sessionId) return null;

    const session = await this.authService.getSessionBySessionId(sessionId);

    if (!session) return null;

    return { userId: payload.sub, username: session.email };
  }
}
