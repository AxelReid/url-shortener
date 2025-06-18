export interface ShortenUrlRequest {
  originalUrl: string;
  expiresAt?: string;
  alias?: string;
}

export interface UrlInfo {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
  clickCount?: number;
  analytics?: Analytics;
}

export interface Analytics {
  clickCount: number;
  recentClicks: Array<{
    ipAddress: string;
    clickedAt: string;
  }>;
  lastClickedIps: string[];
}
