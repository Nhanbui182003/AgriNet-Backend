import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '@app/utils/validate-config';

export type TelegramConfig = {
	token?: string;
	group?: string;
};

class EnvironmentVariablesValidator {
	@IsString()
	TELEGRAM_BOT_TOKEN: string;

	@IsString()
	TELEGRAM_GROUP: string;
}

export default registerAs<TelegramConfig>('telegram', () => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		token: process.env.TELEGRAM_BOT_TOKEN,
		group: process.env.TELEGRAM_GROUP,
	};
});
