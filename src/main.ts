import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MyLoggerService } from './my-logger/my-logger.service';
import { AllEceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllEceptionsFilter(httpAdapter));
  //const app = await NestFactory.create(AppModule, {bufferLogs: true});
  //app.useLogger(app.get(MyLoggerService))
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
