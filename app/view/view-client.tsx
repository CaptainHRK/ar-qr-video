"use client";

import { useSearchParams } from "next/navigation";

export default function ViewClient() {
  const params = useSearchParams();
  const src = params.get("src");

  if (!src) {
    return <p style={{ padding: 20 }}>No media found</p>;
  }

  const decodedSrc = decodeURIComponent(src);

  /* 🔹 Detect image by file extension */
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(decodedSrc);

  return (
    <>
      {isImage ? (
        <img
          src={decodedSrc}
          alt="QR Media"
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "contain",
          }}
        />
      ) : (
        <video
          src={decodedSrc}
          autoPlay
          loop
          controls
          playsInline
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      )}
    </>
  );
}
