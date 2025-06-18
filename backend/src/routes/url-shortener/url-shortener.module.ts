import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, PrismaService],
})
export class UrlShortenerModule {}
