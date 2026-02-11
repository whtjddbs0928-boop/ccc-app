import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  editUrl: string;
  embedUrl: string;
  buttonLabel?: string;
  responsiveMode?: "auto" | "none";
};

function getEditUrlWithMinimal(editUrl: string): string {
  const sep = editUrl.includes("?") ? "&" : "?";
  return `${editUrl}${sep}rm=minimal`;
}

export function DocHub({
  title,
  editUrl,
  embedUrl,
  buttonLabel,
  responsiveMode = "none",
}: Props) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const iframeSrc =
    responsiveMode === "auto" && isDesktop ? getEditUrlWithMinimal(editUrl) : embedUrl;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flex: "0 0 auto",
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
          flex: "1 1 auto",
          width: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src={iframeSrc}
          title={title}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          loading="eager"
        />
      </div>
    </div>
  );
}
