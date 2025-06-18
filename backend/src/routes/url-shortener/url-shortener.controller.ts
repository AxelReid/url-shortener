import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { Request, Response } from 'express';
import { ShortenUrlBodyDto } from './dto/shorten-url-body.dto';

@Controller('url')
export class UrlShortenerController {
  constructor(private readonly service: UrlShortenerService) {}

  @Get(':shortUrl/info')
  getInfo(@Param('shortUrl') shortUrl: string) {
    return this.service.getInfo(shortUrl);
  }

  @Get(':shortUrl/analytics')
  getAnalytics(@Param('shortUrl') shortUrl: string) {
    return this.service.getAnalytics(shortUrl);
  }

  @Get(':shortUrl')
  redirect(
    @Req() req: Request,
    @Res() res: Response,
    @Param('shortUrl') shortUrl: string,
  ) {
    return this.service.redirect(req, res, shortUrl);
  }

  @Post()
  shorten(@Body() body: ShortenUrlBodyDto) {
    return this.service.shorten(body);
  }

  @Delete(':shortUrl')
  delete(@Param('shortUrl') shortUrl: string) {
    return `Deleting "${shortUrl}"`;
  }
}
