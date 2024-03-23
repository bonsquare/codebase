import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        postfixId: '',
        client: {
          brokers: process.env.KAFKA_BROKERS.split(','),
          retry: {
            initialRetryTime: 2000,
            retries: Infinity,
            multiplier: 1,
          },
        },
        consumer: {
          groupId: '{projectName}',
          heartbeatInterval: 500,
        },
      },
    }
  );
  await app.listen();
}

bootstrap();
