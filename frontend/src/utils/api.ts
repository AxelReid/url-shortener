import axios from "axios";
import type { Analytics, ShortenUrlRequest, UrlInfo } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiService {
  async shortenUrl(data: ShortenUrlRequest): Promise<UrlInfo> {
    const response = await api.post("/url", data);
    return response.data;
  }

  async getUrlInfo(shortUrl: string): Promise<UrlInfo> {
    const response = await api.get(`url/${shortUrl}/info`);
    return response.data;
  }

  async getAnalytics(shortUrl: string): Promise<Analytics> {
    const response = await api.get(`/url/${shortUrl}/analytics`);
    return response.data;
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    await api.delete(`/url/${shortUrl}`);
  }

  getRedirectUrl(shortUrl: string): string {
    return `${API_BASE_URL}/url/${shortUrl}`;
  }
}

export default new ApiService();
