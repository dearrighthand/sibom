import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://sibom-web.vercel.app',
      'https://sibom-api.vercel.app',
      'https://sibom.kr',
      'https://www.sibom.kr',
      'capacitor://localhost',
      'http://localhost',
      'https://localhost',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => console.error(err));
