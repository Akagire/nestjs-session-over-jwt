import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://db:27017/local')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
