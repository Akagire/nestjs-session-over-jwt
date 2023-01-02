import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Session {
  @Prop()
  sessionId: string;

  @Prop()
  email: string;

  @Prop({
    type: Date,
    default: new Date(),
    expires: 3600,
  })
  createdTimestamp: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);
