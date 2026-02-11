import React from "react";

type Props = {
  title: string;
  editUrl: string;
  embedUrl: string;
  buttonLabel?: string;
};

export function DocHub({ title, editUrl, embedUrl, buttonLabel }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
        <button
          type="button"
          className="cardBtn"
          onClick={() => (window.location.href = editUrl)}
        >
          {buttonLabel ?? "열기 →"}
        </button>
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          loading="eager"
        />
      </div>
    </div>
  );
}
