import { Global, Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { S3Service } from './aws/s3/s3.service';
import { S3ClientProvider } from './aws/s3/s3-client.provider';
import { TelegramService } from './telegram/telegram.service';

const services = [
	EmailService,
	// TelegramService,
	// S3Service
];

@Global()
@Module({
	providers: [
		...services,
		// S3ClientProvider,
	],
	exports: services,
})
export class ServicesModule {}
