import { Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import { HttpBadRequestError } from '@app/common/errors';

@Injectable()
export class MultipleFileValidationPipe implements PipeTransform {
	private readonly allowedExtensions: string[] = [
		'.jpg',
		'.png',
		'.jpeg',
		'.pdf',
	];
	private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB

	transform(value: Express.Multer.File[]) {
		console.log('Files received in pipe:', value); // Debugging log

		if (!value || (Array.isArray(value) && value.length === 0)) {
			throw new HttpBadRequestError('No files provided');
		}

		if (Array.isArray(value)) {
			return this.validateFilesArray(value);
		}

		if (this.isFileFieldsObject(value)) {
			return this.validateFileFieldsObject(value);
		}

		throw new HttpBadRequestError('Invalid file upload format');
	}

	private isFileFieldsObject(value: any): boolean {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}

	private validateFilesArray(
		files: Express.Multer.File[],
	): Express.Multer.File[] {
		return files.map((file) => this.validateFile(file));
	}

	private validateFileFieldsObject(files: {
		[key: string]: Express.Multer.File[];
	}): {
		[key: string]: Express.Multer.File[];
	} {
		const validatedFiles: { [key: string]: Express.Multer.File[] } = {};

		for (const [field, fileArray] of Object.entries(files)) {
			if (fileArray && fileArray.length > 0) {
				validatedFiles[field] = this.validateFilesArray(fileArray);
			}
		}

		return validatedFiles;
	}

	private validateFile(file: Express.Multer.File): Express.Multer.File {
		this.validateFileName(file);
		this.validateFileExtension(file);
		this.validateFileSize(file);
		return file;
	}

	private validateFileName(file: Express.Multer.File): void {
		if (!file.originalname) {
			this.deleteFile(file);
			throw new HttpBadRequestError('File name is missing');
		}
	}

	private validateFileExtension(file: Express.Multer.File): void {
		const fileExtension = extname(file.originalname).toLowerCase();
		if (!this.allowedExtensions.includes(fileExtension)) {
			this.deleteFile(file);
			throw new HttpBadRequestError(
				`Invalid file type. Allowed extensions are: ${this.allowedExtensions.join(', ')}`,
			);
		}
	}

	private validateFileSize(file: Express.Multer.File): void {
		if (file.size > this.maxFileSize) {
			this.deleteFile(file);
			throw new HttpBadRequestError(
				`File size exceeds the maximum limit of ${this.maxFileSize / (1024 * 1024)}MB`,
			);
		}
	}

	private deleteFile(file: Express.Multer.File): void {
		if (file.path) {
			fs.unlinkSync(file.path);
		}
	}
}
