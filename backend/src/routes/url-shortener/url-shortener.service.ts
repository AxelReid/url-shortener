import {
  BadRequestException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ShortenUrlBodyDto } from './dto/shorten-url-body.dto';

@Injectable()
export class UrlShortenerService {
  constructor(private prisma: PrismaService) {}

  async getInfo(shortUrl: string) {
    const urlRecord = await this.prisma.url.findFirst({
      where: {
        OR: [{ shortUrl }, { alias: shortUrl }],
      },
      select: {
        originalUrl: true,
        createdAt: true,
        _count: { select: { clicks: true } },
      },
    });
    if (!urlRecord) throw new NotFoundException('URL not found');

    return {
      originalUrl: urlRecord.originalUrl,
      createdAt: urlRecord.createdAt,
      clickCount: urlRecord._count.clicks ?? 0,
    };
  }

  async getAnalytics(shortUrl: string) {
    const urlRecord = await this.prisma.url.findFirst({
      where: {
        OR: [{ shortUrl }, { alias: shortUrl }],
      },
      include: {
        _count: { select: { clicks: true } },
        clicks: {
          orderBy: { clickedAt: 'desc' },
          take: 5,
          select: {
            ipAddress: true,
            clickedAt: true,
          },
        },
      },
    });
    if (!urlRecord) throw new NotFoundException('URL not found');

    return {
      clickCount: urlRecord._count.clicks,
      recentClicks: urlRecord.clicks,
      lastClickedIps: urlRecord.clicks.map((click) => click.ipAddress),
    };
  }

  async redirect(req: Request, res: Response, shortUrl: string) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

    const urlRecord = await this.prisma.url.findFirst({
      where: {
        OR: [{ shortUrl }, { alias: shortUrl }],
      },
    });
    if (!urlRecord) throw new NotFoundException('URL not found');

    if (urlRecord.expiresAt && new Date() > urlRecord.expiresAt)
      throw new GoneException('URL has expired');

    await this.prisma.click.create({
      data: {
        urlId: urlRecord.id,
        ipAddress: clientIp,
      },
    });

    res.redirect(urlRecord.originalUrl);
  }

  async shorten({ originalUrl, alias, expiresAt }: ShortenUrlBodyDto) {
    const shortUrl = alias || uuidv4();

    if (alias) {
      const existingUrl = await this.prisma.url.findUnique({
        where: { alias },
      });
      if (existingUrl) throw new BadRequestException('Alias already exists');
    }

    const urlRecord = await this.prisma.url.create({
      data: {
        shortUrl,
        originalUrl,
        alias: alias || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return {
      shortUrl,
      originalUrl,
      createdAt: urlRecord.createdAt,
      expiresAt: urlRecord.expiresAt,
    };
  }

  async delete(shortUrl: string) {
    const urlRecord = await this.prisma.url.findFirst({
      where: {
        OR: [{ shortUrl }, { alias: shortUrl }],
      },
    });

    if (!urlRecord) throw new NotFoundException('URL not found');

    await this.prisma.url.delete({
      where: { id: urlRecord.id },
    });

    return { message: 'URL deleted successfully' };
  }
}
