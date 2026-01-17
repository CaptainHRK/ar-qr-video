"use client";

import { useSearchParams } from "next/navigation";

export default function ViewPage() {
  const params = useSearchParams();
  const src = params.get("src");

  if (!src) {
    return <p style={{ padding: 20 }}>No video found</p>;
  }

  return (
    <video
      src={decodeURIComponent(src)}
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
  );
}
