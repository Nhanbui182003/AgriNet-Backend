import { AuthConfig } from '@app/config/auth.config';
import { FileConfig } from '@app/config/file.config';
import { MailConfig } from '@app/config/mail.config';
import { AppConfig } from '@app/config/app.config';
import { DatabaseConfig } from '@app/config/database.config';
import { RedisConfig } from '@app/config/redis.config';
import { TelegramConfig } from '@app/config/telegram.config';

export type AllConfigType = {
	app: AppConfig;
	auth: AuthConfig;
	database: DatabaseConfig;
	file: FileConfig;
	mail: MailConfig;
	redis: RedisConfig;
	telegram: TelegramConfig;
};
