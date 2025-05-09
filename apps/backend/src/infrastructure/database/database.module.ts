import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getPostgresBaseConfig } from './config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseConfig = getPostgresBaseConfig({
          DATABASE_HOST: configService.get('DATABASE_HOST'),
          DATABASE_PORT: configService.get('DATABASE_PORT'),
          DATABASE_USER: configService.get('DATABASE_USER'),
          DATABASE_PASSWORD: configService.get('DATABASE_PASSWORD'),
          DATABASE_NAME: configService.get('DATABASE_NAME'),
          NODE_ENV: configService.get('NODE_ENV'),
        });

        return {
          ...baseConfig,
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          logging: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),
  ],
})
export class DatabaseModule {} 