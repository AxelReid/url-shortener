import React, { useState } from "react";
import type { ShortenUrlRequest, UrlInfo } from "../types/api";
import api from "../utils/api";

interface UrlShortenerProps {
  onUrlCreated: (url: UrlInfo) => void;
  loading: boolean;
}

export const UrlShortener: React.FC<UrlShortenerProps> = ({
  onUrlCreated,
  loading,
}) => {
  const [formData, setFormData] = useState<ShortenUrlRequest>({
    originalUrl: "",
    expiresAt: "",
    alias: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for submission
      const submitData: ShortenUrlRequest = {
        originalUrl: formData.originalUrl,
      };

      if (formData.expiresAt) {
        submitData.expiresAt = formData.expiresAt;
      }

      if (formData.alias?.trim()) {
        submitData.alias = formData.alias.trim();
      }

      const result = await api.shortenUrl(submitData);
      onUrlCreated(result);
      setSuccess("URL shortened successfully!");

      // Reset form
      setFormData({
        originalUrl: "",
        expiresAt: "",
        alias: "",
      });
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to shorten URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <h2>Create Short URL</h2>

      {error && <div className="error">{error}</div>}

      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl">Original URL *</label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleInputChange}
            placeholder="https://example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="alias">Custom Alias (optional)</label>
          <input
            type="text"
            id="alias"
            name="alias"
            value={formData.alias}
            onChange={handleInputChange}
            placeholder="my-custom-link"
            maxLength={20}
          />
          <small style={{ color: "#6c757d" }}>
            Max 20 characters, alphanumeric only
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="expiresAt">Expiration Date (optional)</label>
          <input
            type="datetime-local"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleInputChange}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <button
          type="submit"
          className="btn"
          disabled={isSubmitting || loading || !formData.originalUrl}
        >
          {isSubmitting ? "Creating..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
};
