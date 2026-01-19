"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [mediaLink, setMediaLink] = useState("");

  async function handleUpload(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      let mediaUrl = "";

      /* MODE 1: Upload file */
      if (mode === "upload") {
        const formData = new FormData();
        formData.append("video", e.target.video.files[0]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        mediaUrl = data.videoUrl;
      }

      /* MODE 2: Direct link */
      if (mode === "link") {
        if (!mediaLink) {
          alert("Please enter a valid media link");
          setLoading(false);
          return;
        }
        mediaUrl = mediaLink;
      }

      const qrUrl = `${window.location.origin}/view?src=${encodeURIComponent(
        mediaUrl
      )}`;

      const qrImage = await QRCode.toDataURL(qrUrl);
      setQr(qrImage);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qr) return;

    const link = document.createElement("a");
    link.href = qr;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AR QR Media Generator</h1>

      {/* MODE SELECTION */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
          {" "}Upload file
        </label>

        <label>
          <input
            type="radio"
            checked={mode === "link"}
            onChange={() => setMode("link")}
          />
          {" "}Link to QR
        </label>
      </div>

      <form onSubmit={handleUpload}>
        {/* FILE INPUT (video + image supported) */}
        {mode === "upload" && (
          <input
            type="file"
            name="video"
            accept="video/*,image/*"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.size > 4.5 * 1024 * 1024) {
                alert("Max file size is 4.5MB");
                e.target.value = "";
              }
            }}
          />
        )}

        {/* LINK INPUT */}
        {mode === "link" && (
          <input
            type="url"
            placeholder="Paste image or video link"
            value={mediaLink}
            onChange={(e) => setMediaLink(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        )}

        <button type="submit">Generate QR</button>
      </form>

      {loading && <p>Processing...</p>}

      {qr && (
        <>
          <h3>Your QR Code</h3>
          <img src={qr} width={280} />

          <div style={{ marginTop: 12 }}>
            <button onClick={downloadQR}>
              Download QR (PNG)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
