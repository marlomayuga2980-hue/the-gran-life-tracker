import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #EDD99E 0%, #D6BC8A 50%, #C4A870 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Gloss shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            borderRadius: "40px 40px 0 0",
            background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* G lettermark */}
        <span
          style={{
            fontSize: 118,
            fontWeight: 900,
            color: "#2C3E6B",
            lineHeight: 1,
            fontFamily: "serif",
            marginTop: 8,
          }}
        >
          G
        </span>
      </div>
    ),
    { ...size }
  );
}
