import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";

// ✅ 여기 URL만 나중에 너 구글 문서/시트 링크로 바꾸면 됨
const PAGES = [
  { key: "manpower", label: "📊 맨파워 (구글시트)", path: "/manpower", type: "link", url: "https://docs.google.com/spreadsheets/" },
  { key: "minutes", label: "📝 대순장 회의록 (구글닥스)", path: "/minutes", type: "link", url: "https://docs.google.com/document/" },
  { key: "family", label: "👨‍👩‍👧 가족순별 맨파워", path: "/family", type: "placeholder" },
  { key: "curriculum", label: "📚 가족순별 커리큘럼", path: "/curriculum", type: "placeholder" },
  { key: "schedule", label: "📅 CCC 전체 일정표", path: "/schedule", type: "placeholder" },
  { key: "bridge", label: "🌉 기능순 - 브릿지순", path: "/teams/bridge", type: "placeholder" },
  { key: "tongtong", label: "🕊 기능순 - 통통순(통일순)", path: "/teams/tongtong", type: "placeholder" },
  { key: "praise", label: "🎶 기능순 - 찬양순", path: "/teams/praise", type: "placeholder" }
];

function PageFrame({ title, children }) {
  return (
    <div className="page">
      <div className="pageHeader">
        <h1 className="pageTitle">{title}</h1>
      </div>
      <div className="pageBody">{children}</div>
    </div>
  );
}

function LinkCard({ url }) {
  const hostname = useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }, [url]);

  return (
    <div className="card">
      <div className="cardTitle">외부 문서</div>
      <div className="cardSub">{hostname}</div>
      <a className="cardBtn" href={url} target="_blank" rel="noreferrer">
        열기 →
      </a>
      <div className="cardHint">
        * iOS 사파리에서 구글 문서/시트 임베드는 권한/쿠키 설정에 따라 로그인 팝업이 뜰 수 있어.
      </div>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <PageFrame title={title}>
      <div className="empty">
        <div className="emptyTitle">여기부터 채우면 됨</div>
        <div className="emptyText">
          이 페이지는 아직 비어있어. <br />
          다음 단계에서 구글 시트/닥스 링크(또는 iframe 임베드)로 바로 연결해줄게.
        </div>
      </div>
    </PageFrame>
  );
}

function Home() {
  return (
    <PageFrame title="CCC 대순장">
      <div className="grid">
        <div className="card">
          <div className="cardTitle">빠른 시작</div>
          <div className="cardSub">왼쪽 메뉴에서 문서를 선택해.</div>
          <div className="cardHint">
            다음 단계: 각 메뉴에 구글 시트/닥스 “웹에 게시” 링크를 넣고, iframe 임베드로 바로 보여주기.
          </div>
        </div>
        <div className="card">
          <div className="cardTitle">오늘 할 일</div>
          <div className="cardSub">추후 자동 요약/공지 모듈 추가 가능</div>
          <div className="cardHint">예: 회의 안건, 일정, 맨파워 변동 체크</div>
        </div>
      </div>
    </PageFrame>
  );
}

function Sidebar({ onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandDot" />
        <div>
          <div className="brandTitle">CCC 대순장</div>
          <div className="brandSub">Notion-style hub</div>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => "navItem" + (isActive ? " active" : "")} onClick={onNavigate}>
          🏠 홈
        </NavLink>

        <div className="navSection">문서</div>
        {PAGES.slice(0, 2).map((p) => (
          <NavLink key={p.key} to={p.path} className={({ isActive }) => "navItem" + (isActive ? " active" : "")} onClick={onNavigate}>
            {p.label}
          </NavLink>
        ))}

        <div className="navSection">가족순</div>
        {PAGES.slice(2, 5).map((p) => (
          <NavLink key={p.key} to={p.path} className={({ isActive }) => "navItem" + (isActive ? " active" : "")} onClick={onNavigate}>
            {p.label}
          </NavLink>
        ))}

        <div className="navSection">기능순</div>
        {PAGES.slice(5).map((p) => (
          <NavLink key={p.key} to={p.path} className={({ isActive }) => "navItem" + (isActive ? " active" : "")} onClick={onNavigate}>
            {p.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebarFooter">
        <div className="small">v0.1</div>
        <div className="small">PWA • iPhone Safari</div>
      </div>
    </aside>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="appShell">
      {/* 모바일 헤더 */}
      <header className="mobileTop">
        <button className="iconBtn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          ☰
        </button>
        <div className="mobileTitle">CCC 대순장</div>
      </header>

      {/* 오버레이 */}
      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <div className={"sidebarWrap" + (mobileOpen ? " open" : "")}>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
  path="/manpower"
  element={
    <PageFrame title="📊 맨파워 (구글시트)">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <a
          href="https://docs.google.com/spreadsheets/d/1wPceCL3lZ6Bi1jiFJQ7bSxYByUsscL-4vfRt_R4Owoc/view?usp=sharing"
          style={{ fontSize: 14, color: "#2563eb", textDecoration: "underline" }}
        >
          구글시트에서 열기
        </a>
      </div>

      <iframe
        src="https://docs.google.com/spreadsheets/d/1wPceCL3lZ6Bi1jiFJQ7bSxYByUsscL-4vfRt_R4Owoc/edit"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="맨파워 구글시트"
      />
    </PageFrame>
  }
/>

          <Route
            path="/minutes"
            element={
              <PageFrame title="📝 대순장 회의록 (구글닥스)">
                <LinkCard url={PAGES[1].url} />
              </PageFrame>
            }
          />

          <Route path="/family" element={<Placeholder title="👨‍👩‍👧 가족순별 맨파워" />} />
          <Route path="/curriculum" element={<Placeholder title="📚 가족순별 커리큘럼" />} />
          <Route path="/schedule" element={<Placeholder title="📅 CCC 전체 일정표" />} />

          <Route path="/teams/bridge" element={<Placeholder title="🌉 기능순 - 브릿지순" />} />
          <Route path="/teams/tongtong" element={<Placeholder title="🕊 기능순 - 통통순(통일순)" />} />
          <Route path="/teams/praise" element={<Placeholder title="🎶 기능순 - 찬양순" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
