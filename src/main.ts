import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT'), () => {
    console.log(
      `🚀 Server ready at http://${config.get('HOST')}:${config.get('PORT')}`,
    );
  });
}
bootstrap();
