// src/common/transformers/date.transformer.ts
import { Transform } from 'class-transformer';

export const TransformToUtc = () =>
	Transform(({ value }) => {
		if (!value) return value;
		const date = value instanceof Date ? value : new Date(value);
		// Đảm bảo trả về UTC ISO string
		return date.toISOString();
	});
