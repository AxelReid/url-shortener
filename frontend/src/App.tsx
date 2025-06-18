import { useState } from "react";
import type { UrlInfo } from "./types/api";
import api from "./utils/api";
import { UrlShortener } from "./component/UrlShortener";
import { UrlList } from "./component/UrlList";

function App() {
  const [urls, setUrls] = useState<UrlInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlCreated = (newUrl: UrlInfo) => {
    setUrls((prev) => [newUrl, ...prev]);
  };

  const handleUrlDeleted = async (shortUrl: string) => {
    try {
      setLoading(true);
      await api.deleteUrl(shortUrl);
      setUrls((prev) => prev.filter((url) => url.shortUrl !== shortUrl));
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to delete URL");
    } finally {
      setLoading(false);
    }
  };

  const handleGetInfo = async (shortUrl: string) => {
    try {
      setLoading(true);
      const info = await api.getUrlInfo(shortUrl);
      setUrls((prev) =>
        prev.map((url) =>
          url.shortUrl === shortUrl ? { ...url, ...info } : url,
        ),
      );
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to get URL info");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAnalytics = async (shortUrl: string) => {
    try {
      setLoading(true);
      const analytics = await api.getAnalytics(shortUrl);
      setUrls((prev) =>
        prev.map((url) =>
          url.shortUrl === shortUrl
            ? { ...url, clickCount: analytics.clickCount, analytics }
            : url,
        ),
      );
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to get analytics");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div id="fade" />
      <div className="container">
        <div className="header">
          <h1>🔗 URL Shortener</h1>
          <p>Create short, memorable URLs for your links</p>
        </div>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
            <button
              onClick={() => setError(null)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}

        <UrlShortener onUrlCreated={handleUrlCreated} loading={loading} />

        <UrlList
          urls={urls}
          onDelete={handleUrlDeleted}
          onGetInfo={handleGetInfo}
          onGetAnalytics={handleGetAnalytics}
          loading={loading}
        />
      </div>
    </>
  );
}

export default App;
