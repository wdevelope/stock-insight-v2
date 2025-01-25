import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();

console.log('process.env.DATABASE_HOST', process.env.DATABASE_HOST);
console.log('process.env.DATABASE_USER', process.env.DATABASE_USER);
console.log('process.env.DATABASE_PASSWORD', process.env.DATABASE_PASSWORD);
console.log('process.env.DATABASE_NAME', process.env.DATABASE_NAME);

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  autoLoadEntities: true,
  timezone: 'UTC',
};
