import React from "react";
import type { UrlInfo } from "../types/api";
import api from "../utils/api";

interface UrlListProps {
  urls: UrlInfo[];
  onDelete: (shortUrl: string) => void;
  onGetInfo: (shortUrl: string) => void;
  onGetAnalytics: (shortUrl: string) => void;
  loading: boolean;
}

export const UrlList: React.FC<UrlListProps> = ({
  urls,
  onDelete,
  onGetInfo,
  onGetAnalytics,
  loading,
}) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (urls.length === 0) {
    return (
      <div className="card">
        <h2>Your URLs</h2>
        <p style={{ textAlign: "center", color: "#6c757d", padding: "2rem" }}>
          No URLs created yet. Create your first short URL above!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Your URLs ({urls.length})</h2>

      {loading && <div className="loading">Loading...</div>}

      {urls.map((url) => (
        <div key={url.shortUrl} className="url-item">
          <h3>
            <a
              href={api.getRedirectUrl(url.shortUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {api.getRedirectUrl(url.shortUrl)}
            </a>
          </h3>

          <p>
            <strong>Original:</strong>
            <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
              {url.originalUrl}
            </a>
          </p>

          <p>
            <strong>Created:</strong> {formatDate(url.createdAt)}
          </p>

          {url.expiresAt && (
            <p>
              <strong>Expires:</strong> {formatDate(url.expiresAt)}
            </p>
          )}

          {url.clickCount !== undefined && (
            <p>
              <strong>Clicks:</strong> {url.clickCount}
            </p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button
              className="btn btn-secondary"
              onClick={() => copyToClipboard(api.getRedirectUrl(url.shortUrl))}
              disabled={loading}
            >
              📋 Copy
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => onGetInfo(url.shortUrl)}
              disabled={loading}
            >
              ℹ️ Info
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => onGetAnalytics(url.shortUrl)}
              disabled={loading}
            >
              📊 Analytics
            </button>

            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this URL?")
                ) {
                  onDelete(url.shortUrl);
                }
              }}
              disabled={loading}
            >
              🗑️ Delete
            </button>
          </div>

          {url.analytics && (
            <div className="analytics">
              <h4>📈 Analytics</h4>
              <p>
                <strong>Total Clicks:</strong> {url.analytics.clickCount}
              </p>

              {url.analytics.recentClicks.length > 0 && (
                <div>
                  <p>
                    <strong>Recent Clicks:</strong>
                  </p>
                  <ul className="ip-list">
                    {url.analytics.recentClicks.map((click, index) => (
                      <li key={index}>
                        {click.ipAddress} - {formatDate(click.clickedAt)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {url.analytics.lastClickedIps.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <p>
                    <strong>Last 5 IP Addresses:</strong>
                  </p>
                  <ul className="ip-list">
                    {url.analytics.lastClickedIps.map((ip, index) => (
                      <li key={index}>{ip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
