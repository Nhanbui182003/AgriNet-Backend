import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
	type: (process.env.DATABASE_TYPE as DatabaseType) || 'mysql',
	host: process.env.DATABASE_HOST || 'localhost',
	port: process.env.DATABASE_PORT
		? parseInt(process.env.DATABASE_PORT, 10)
		: 3306,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
	dropSchema: false,
	logging: process.env.NODE_ENV !== 'production',
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
	extra: {
		// max connection pool size
		// Use 'connectionLimit' for MySQL, 'max' for PostgreSQL
		connectionLimit: process.env.DATABASE_MAX_CONNECTIONS
			? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
			: 100,
		ssl:
			process.env.DATABASE_SSL_ENABLED === 'true'
				? {
						rejectUnauthorized:
							process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
						ca: process.env.DATABASE_CA ?? undefined,
						key: process.env.DATABASE_KEY ?? undefined,
						cert: process.env.DATABASE_CERT ?? undefined,
					}
				: undefined,
	},
} as DataSourceOptions);
