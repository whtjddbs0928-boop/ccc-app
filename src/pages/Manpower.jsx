import { useMemo, useState } from "react";

const SHEET_EDIT_URL =
  "https://docs.google.com/spreadsheets/d/1wPceCL3lZ6Bi1jiFJQ7bSxYByUsscL-4vfRt_R4Owoc/edit";

// iframe에서 "로그인 없이 읽기"를 안정적으로 하려면 구글시트에서
// 공유(링크 있는 모든 사용자 보기) + 가능하면 "웹에 게시"를 켠 뒤 pubhtml 링크를 쓰는 게 가장 안정적입니다.
// 웹에 게시가 안 된 경우에도 일단 embed 시도 + 아래 버튼으로 외부 열기 fallback.
const SHEET_EMBED_URL =
  "https://docs.google.com/spreadsheets/d/1wPceCL3lZ6Bi1jiFJQ7bSxYByUsscL-4vfRt_R4Owoc/pubhtml?widget=true&headers=false";

export function ManpowerPage() {
  const [loaded, setLoaded] = useState(false);

  const openSheet = () => {
    // iOS PWA에서 target=_blank가 막히는 경우가 있어, 같은 탭 이동이 더 안정적
    window.location.href = SHEET_EDIT_URL;
  };

  const hint = useMemo(() => {
    if (loaded) return "시트가 보이지 않으면 아래 버튼으로 열어주세요.";
    return "불러오는 중… (안 뜨면 아래 버튼으로 열어주세요)";
  }, [loaded]);

  return (
    <div style={{ height: "100%", minHeight: "calc(100dvh - 56px)" }}>
      <div style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>📊 맨파워 (구글시트)</div>
        <button className="cardBtn" onClick={openSheet}>
          구글시트 열기 →
        </button>
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <div className="cardHint" style={{ marginBottom: 10 }}>
          {hint}
        </div>

        <div
          style={{
            width: "100%",
            height: "calc(100dvh - 56px - 12px - 12px - 44px)",
            minHeight: 420,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <iframe
            src={SHEET_EMBED_URL}
            title="맨파워 구글시트"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}



