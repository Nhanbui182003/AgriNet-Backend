import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { S3ClientProvider } from './s3-client.provider';
import { ConfigKeys } from '@app/config/config-key.enum';

@Injectable()
export class S3Service {
	private readonly logger = new Logger(S3Service.name);
	private readonly s3Client: S3Client;
	private readonly s3Bucket: string;
	private readonly s3Url: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly s3ClientProvider: S3ClientProvider,
	) {
		this.s3Client = this.s3ClientProvider.client;
		this.s3Bucket = this.configService.getOrThrow(
			ConfigKeys.AWS_DEFAULT_S3_BUCKET,
		);
		this.s3Url = this.configService.getOrThrow(ConfigKeys.AWS_DEFAULT_S3_URL);
		this.logger.debug('S3Service initialized');
	}

	async uploadPublicFile(
		fileName: string,
		dataBuffer: Buffer,
		mimeType: string,
	) {
		const extension = fileName.split('.').pop();
		const newFilename = `${v4()}.${extension}`;

		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: this.s3Bucket,
				Key: newFilename,
				Body: dataBuffer,
				ContentType: mimeType,
			}),
		);

		return {
			fileName: fileName,
			fileUrl: `${this.s3Url}/${newFilename}`,
		};
	}

	deleteFile(fileName: string) {
		return this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: this.s3Bucket,
				Key: fileName,
			}),
		);
	}
}
