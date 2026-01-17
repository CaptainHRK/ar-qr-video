import { Suspense } from "react";
import ViewClient from "./view-client";

export default function ViewPage() {
  return (
    <Suspense fallback={<p style={{ padding: 20 }}>Loading video...</p>}>
      <ViewClient />
    </Suspense>
  );
}
