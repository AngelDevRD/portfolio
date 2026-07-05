import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0b 0%, #10131f 60%, #1a1030 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #0a84ff, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            {site.name.charAt(0)}
          </div>
          <span style={{ fontSize: 30, opacity: 0.8 }}>{site.location}</span>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{site.name}</div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#0a84ff" }}>{site.role}</div>
        <div style={{ fontSize: 30, marginTop: 24, opacity: 0.7, maxWidth: 900 }}>{site.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
