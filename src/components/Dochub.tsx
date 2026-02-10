// src/components/DocHub.tsx
import React from "react";

type Props = {
  title: string;
  viewUrl: string; // 읽기 링크 (혹은 published/preview)
  editUrl: string; // 편집 링크
  embedUrl?: string; // 가능하면 iframe용
};

export function DocHub({ title, viewUrl, editUrl, embedUrl }: Props) {
  const openEdit = () => {
    // iOS PWA에서 target=_blank 보다 현재 탭 이동이 안정적
    window.location.href = editUrl;
  };

  const openView = () => {
    window.location.href = viewUrl;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openView}>보기</button>
          <button onClick={openEdit}>편집하기</button>
        </div>
      </div>

      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          style={{ flex: 1, width: "100%", border: "1px solid #e5e5e5", borderRadius: 12 }}
        />
      ) : (
        <div style={{ padding: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}>
          <p style={{ marginTop: 0 }}>
            미리보기가 제한될 수 있어요. 아래 버튼으로 열어주세요.
          </p>
          <button onClick={openView}>문서 열기</button>
        </div>
      )}
    </div>
  );
}

