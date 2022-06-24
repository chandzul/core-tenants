import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(':tenant?/api'); // urlapi.com/namecompany/api/users -> namecompany name

  await app.listen(AppModule.port || 3000);
}

bootstrap();
