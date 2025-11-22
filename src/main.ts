import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@app/config/config.type';
import { HttpExceptionFilter } from './common/filters/error.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { TelegramService } from './services/telegram/telegram.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigKeys } from './config/config-key.enum';
import { useContainer } from 'class-validator';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: true,
	});
	// Configure class-validator to use NestJS dependency injection
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	const configService = app.get(ConfigService<AllConfigType>);

	app.setGlobalPrefix(
		configService.getOrThrow(ConfigKeys.API_PREFIX, { infer: true }),
		{
			exclude: ['/'],
		},
	);

	app.useGlobalFilters(new HttpExceptionFilter(configService));

	app.useGlobalPipes(new ValidationPipe(validationOptions));

	app.useGlobalInterceptors(
		new TransformInterceptor(),
		new ErrorInterceptor(new TelegramService(configService)),
		new LoggingInterceptor(),
	);

	const options = new DocumentBuilder()
		.setTitle(configService.getOrThrow(ConfigKeys.APP_NAME, { infer: true }))
		.setDescription('Rally System API')
		.setVersion('1.0')
		.addBearerAuth({
			type: 'http',
			description: 'Enter JWT token',
			in: 'header',
		})
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api/docs', app, document);

	const PORT =
		configService.getOrThrow(ConfigKeys.APP_PORT, { infer: true }) || 3000;
	await app.listen(PORT);

	return configService;
}

bootstrap().then((configService) => {
	const logger = new Logger(AppModule.name);
	const backendDomain = configService.getOrThrow(ConfigKeys.BACKEND_DOMAIN, {
		infer: true,
	});
	logger.log(`URL Swagger ${backendDomain}/api/docs`);
	logger.log(`Starting on ${backendDomain}`);
});
