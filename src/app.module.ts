import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      process.env.MONGO_URI,
      {
        dbName: process.env.MONGO_DBNAME
      }
    ),
    
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: {
        expiresIn: '30m'
      }
    }),

    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
