import { IsDate, IsUrl, IsString, IsOptional } from 'class-validator';

export class ShortenUrlBodyDto {
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Must be an URL and start with `https` or `http`' },
  )
  originalUrl: string;

  @IsDate()
  @IsOptional()
  expiresAt?: Date;

  @IsString()
  @IsOptional()
  alias?: string;
}
