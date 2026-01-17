"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("video", e.target.video.files[0]);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const qrUrl = `${window.location.origin}/view?src=${encodeURIComponent(
      data.videoUrl
    )}`;

    const qrImage = await QRCode.toDataURL(qrUrl);
    setQr(qrImage);
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AR QR Video Generator</h1>

      <form onSubmit={handleUpload}>
<input
  type="file"
  name="video"
  accept="video/*"
  required
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 4.5 * 1024 * 1024) {
      alert("Max video size is 4.5MB");
      e.target.value = "";
    }
  }}
/>

        <button type="submit">Generate QR</button>
      </form>

      {loading && <p>Uploading...</p>}

      {qr && (
        <>
          <h3>Your QR Code</h3>
          <img src={qr} width={280} />
        </>
      )}
    </div>
  );
}
