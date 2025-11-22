import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AllConfigType } from '@app/config/config.type';
import { ConfigKeys } from '@app/config/config-key.enum';

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<AllConfigType>) => ({
				secret: configService.get(ConfigKeys.JWT_SECRET, {
					infer: true,
				}),
				signOptions: {
					expiresIn: configService.get(ConfigKeys.JWT_EXPIRES, {
						infer: true,
					}),
				},
			}),
			global: true,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
