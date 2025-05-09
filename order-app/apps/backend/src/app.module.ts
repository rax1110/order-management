import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrdersModule } from './domain/order/order.module';

@Module({
  imports: [
    ConfigModule,
    CoreModule,
    DatabaseModule,
    OrdersModule,
  ],
})
export class AppModule {}
