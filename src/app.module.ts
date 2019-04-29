import { Module } from '@nestjs/common';
import { CorsMiddleware } from '@/bing';
import { TypeOrmModule } from '@nestjs/typeorm';
import modules from './app';

@Module({
    imports: [
        TypeOrmModule.forRoot(), ...modules,
    ],
})

export class ApplicationModule {}
