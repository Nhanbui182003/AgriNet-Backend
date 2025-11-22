import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient } from 'messaging-api-telegram';
import { ConfigKeys } from '@app/config/config-key.enum';

@Injectable()
export class TelegramService {
	private client: TelegramClient;

	constructor(private readonly configService: ConfigService) {
		const accessToken = this.configService.get(ConfigKeys.TELEGRAM_BOT_TOKEN);
		if (accessToken) {
			this.client = new TelegramClient({
				accessToken,
			});
		}
	}

	public async handleRequestError(method, url, body = {}, error) {
		const ignoreStatuses = [
			HttpStatus.NOT_FOUND,
			HttpStatus.UNAUTHORIZED,
			HttpStatus.FORBIDDEN,
			HttpStatus.BAD_REQUEST,
		];
		const ignoreMessages = [
			'Incorrect username or password',
			'Invalid Refresh Token',
			'Refresh Token has expired',
		];
		if (error?.status && ignoreStatuses.includes(error.status)) {
			return;
		}
		for (const message of ignoreMessages) {
			if (error?.message?.toLowerCase().includes(message.toLowerCase())) {
				return;
			}
		}
		const privateFields = ['password', 'newPassword'];
		for (const field of privateFields) {
			if (body[field]) {
				body[field] = '******';
			}
		}
		const message = `${method} ${url}\nBody: ${JSON.stringify(body)}\nError: ${error.stack || error.message}`;
		await this.client?.sendMessage(
			this.configService.getOrThrow(ConfigKeys.TELEGRAM_GROUP),
			message,
		);
	}

	public async sendMessage(message: string) {
		await this.client?.sendMessage(
			this.configService.getOrThrow(ConfigKeys.TELEGRAM_GROUP),
			message,
		);
	}
}
