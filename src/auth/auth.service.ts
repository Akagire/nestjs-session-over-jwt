import * as crypto from 'crypto';
import { Session, SessionDocument } from './../schemas/session.schema';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) return null;
    if (user.password !== pass) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const sessions = await this.getExistSessions(user.username);
    if (sessions.length > 0) {
      await this.deleteSessions(sessions);
    }

    const sessionId = await this.createSession(user.username);
    const payload = { session_id: sessionId, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createSession(email: string) {
    const sessionId = crypto.randomUUID();

    const session = new this.sessionModel({
      sessionId,
      email,
    });
    const result = await session.save();

    return result.sessionId;
  }

  getSessionBySessionId(sessionId: string) {
    return this.sessionModel.findOne({ sessionId });
  }

  getExistSessions(email: string) {
    return this.sessionModel.find({ email });
  }

  deleteSessions(sessions: SessionDocument[]) {
    Promise.all(
      sessions.map(async (session) => {
        await session.remove();
      }),
    );
  }
}
