import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Request } from 'express';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { DataSource, DataSourceOptions } from 'typeorm';

import databaseConfig from '@app/config/database.config';
import appConfig from '@app/config/app.config';
import mailConfig from '@app/config/mail.config';
import telegramConfig from '@app/config/telegram.config';
import authConfig from '@app/config/auth.config';
import fileConfig from '@app/config/file.config';
import redisConfig from '@app/config/redis.config';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { TypeOrmConfigService } from '@app/database/typeorm-config.service';
import { ValidationPipe } from '@app/common/pipes/validation.pipe';
import { ServicesModule } from './services/services.module';
import { CorsMiddleware } from './common/middlewares/cors.middleware';
import { OriginMiddleware } from './common/middlewares/origin.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { getContentType } from './utils/content-type-file';
import { CategoriesModule } from './modules/categories/categories.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostImagesModule } from './modules/post-images/post-images.module';
import { PostEmbeddingsModule } from './modules/post-embeddings/post-embeddings.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				databaseConfig,
				appConfig,
				authConfig,
				// fileConfig,
				mailConfig,
				// telegramConfig,
				redisConfig,
			],
			envFilePath: ['.env'],
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
			serveRoot: '/public',
			serveStaticOptions: {
				maxAge: '30d',
				setHeaders: (res, path) => {
					res.setHeader('Content-Type', getContentType(path));
					res.setHeader(
						'Cache-Control',
						`public, max-age=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`,
					);

					// Add CORS headers for canvas compatibility
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
					res.setHeader(
						'Access-Control-Allow-Headers',
						'Origin, X-Requested-With, Content-Type, Accept',
					);
					res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
					res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
				},
			},
		}),
		ThrottlerModule.forRoot([
			{
				ttl: minutes(5),
				limit: 600,
				ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
				skipIf: (context) => {
					// Skip throttle for the front-end server.
					const request = context.switchToHttp().getRequest<Request>();
					// Work only for front-end applications running on the same host machine.
					return (
						request.hostname === 'localhost' ||
						['127.0.0.1', '::1'].includes(request.ip || '')
					);
				},
			},
		]),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: async (options: DataSourceOptions) => {
				return new DataSource(options).initialize();
			},
		}),
		EventEmitterModule.forRoot(),
		ServicesModule,
		AuthModule,
		UsersModule,
		CategoriesModule,
		PostsModule,
		PostImagesModule,
		PostEmbeddingsModule,
		CommentsModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorsMiddleware, OriginMiddleware).forRoutes('*');
	}
}
