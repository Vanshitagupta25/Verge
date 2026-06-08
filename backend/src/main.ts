import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add middleware to log all headers
  app.use((req, res, next) => {
    const originalSetHeader = res.setHeader.bind(res);
    res.setHeader = function(key: string, value: any) {
      console.log(`Setting header: ${key} = ${value}`);
      return originalSetHeader(key, value);
    };
    
    next();
  });

  app.use((req, res, next) => {
    const allowedOrigins = ['https://verge-gzoe.vercel.app', 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      console.log(`Allowing origin: ${origin}`);
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (origin) {
      console.log(`Blocking origin: ${origin}`);
      res.status(403).json({ error: 'CORS origin not allowed' });
      return;
    } else {
      console.log(`No origin header, allowing all`);
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    if (req.method === 'OPTIONS') {
      console.log('Responding to OPTIONS preflight');
      res.status(204).end();
      return;
    }
    
    next();
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}

bootstrap();