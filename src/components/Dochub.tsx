import React, { useState } from "react";

type Props = {
  title: string;
  editUrl: string;
  embedUrl: string;
  /** 기본: "문서 열기 →" */
  buttonLabel?: string;
};

export function DocHub({ title, editUrl, embedUrl, buttonLabel = "문서 열기 →" }: Props) {
  const [loaded, setLoaded] = useState(false);

  const openDoc = () => {
    // iOS PWA에서 target=_blank 보다 현재 탭 이동이 안정적
    window.location.href = editUrl;
  };

  return (
    <div style={{ height: "100%", minHeight: "calc(100dvh - 56px)" }}>
      <div style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <button type="button" className="cardBtn" onClick={openDoc}>
          {buttonLabel}
        </button>
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <div className="cardHint" style={{ marginBottom: 10 }}>
          {loaded ? "문서가 안 보이면 위 버튼으로 열어주세요." : "불러오는 중… (안 뜨면 위 버튼으로 열어주세요)"}
        </div>

        <div
          style={{
            width: "100%",
            height: "calc(100dvh - 56px - 12px - 12px - 44px)",
            minHeight: 420,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
