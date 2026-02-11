import { Routes, Route, NavLink, Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DocHub } from "./components/Dochub";
import { MINUTES_EDIT_URL, MINUTES_EMBED_URL } from "./config/docs";
import { ManpowerPage } from "./pages/Manpower";

const FAMILY_GROUPS_INITIAL = [
  {
    id: "yare",
    title: "1 가족순 - 야레 (전정)",
    leader: "진승범",
    subLeaders: ["김도윤", "장준하"],
    notes: ["견제 혹은 보조장치 혹은 교육이 필요 - 순을 목적있게 끌고 가기위해"],
    membersBlock1: "진승범, 장준하, 김도윤, 김민준, 조민성",
    membersBlock2: "정순광, 이규빈",
  },
  {
    id: "coram",
    title: "2 가족순 - 코람",
    leader: "김덕훈",
    subLeaders: ["최인규"],
    notes: [
      "정예찬: 내년에 재정적인 이유로 휴학 예정 + 아직 순장 동기부여가 안 된 상태라 부가족 순장은 무리",
      "이 상태로 너무 오래 지속되었기에 대책이 필요",
    ],
    membersBlock1: "김덕훈, 최인규, 임요셉, 김대현, 김민석, 정지빈, 정예찬, 황지민, 이선우, 안익태, 이원영",
    membersBlock2: "홍현준, 박이안, 남요셉",
  },
  {
    id: "cream",
    title: "3 가족순 - 크림 (디반물)",
    leader: "조성윤",
    subLeaders: ["이은찬"],
    notes: [
      "은찬이가 가족순장이여도 될 듯, 박희영·이의진이 부가족순장",
      "이의진, 이한호 별도 대화 필요",
    ],
    membersBlock1: "조성윤, 이은찬, 박희영, 이의진, 이한호",
    membersBlock2: "강희준, 강대원, 최산, 박성준, 박찬민",
  },
  {
    id: "david",
    title: "4 가족순 - 다윗 (전기융·빅데)",
    leader: "도현서",
    subLeaders: ["박예찬"],
    notes: ["총무순장: 김철환, 최치우"],
    membersBlock1: "김한영, 도현서, 박예찬, 김철환, 최치우, 이성빈, 최예준",
    membersBlock2: "김준우, 황인용, 서하진, 고관우",
  },
  {
    id: "yeolae",
    title: "5 가족순 - 열애순 (식공·화학·환공)",
    leader: "이다현",
    subLeaders: ["이가희"],
    notes: [
      "총무순장: 박주아, 문경지",
      "다현 → 시연: 굿 팔로워로 도와달라는 연락이 필요해 보임",
    ],
    membersBlock1: "이다현, 23이가희, 박주아, 문경지",
    membersBlock2: "고시연, 이희재, 김진서",
  },
  {
    id: "jubarak",
    title: "6 가족순 - 주바라기 (공정대)",
    leader: "유현경",
    subLeaders: ["조하영", "박하은"],
    notes: [],
    membersBlock1: "유현경, 조하영, 박하은",
    membersBlock2: "박시온, 박소은, 오예람",
  },
  {
    id: "yegrina",
    title: "7 가족순 - 예그리나",
    leader: "윤어진",
    subLeaders: ["원희정"],
    notes: [
      "부가족순장 원희정: 마음은 있고 긍정적이나 통학할 수도 있어 시간표 확정 후 다시 논의",
      "총무순장: 양선영",
    ],
    membersBlock1: "윤어진, 원희정, 양선영, 오소람",
    membersBlock2: "권혜인, 최예윤",
  },
  {
    id: "firstcome",
    title: "8 가족순 - 선착순 (전정·전기융·생공·스도·디헬공)",
    leader: "이소희",
    subLeaders: ["권소희", "이소민"],
    notes: ["김채은 위치 조정 필요"],
    membersBlock1: "이소희, 이소민, 25이가희, 김채은, 문선우, 김다연, 권소희",
    membersBlock2: "",
  },
];

// ✅ 여기 URL만 나중에 너 구글 문서/시트 링크로 바꾸면 됨
const PAGES = [
  { key: "manpower", label: "📊 맨파워 (구글시트)", path: "/manpower", type: "link", url: "https://docs.google.com/spreadsheets/" },
  { key: "minutes", label: "📝 대순장 회의록 (구글닥스)", path: "/minutes", type: "link", url: MINUTES_EDIT_URL },
  { key: "family", label: "👨‍👩‍👧 가족순별 맨파워", path: "/family", type: "placeholder" },
  { key: "curriculum", label: "📚 가족순별 커리큘럼", path: "/curriculum", type: "placeholder" },
  { key: "schedule", label: "📅 CCC 전체 일정표", path: "/schedule", type: "placeholder" },
  { key: "bridge", label: "🌉 기능순 - 브릿지순", path: "/teams/bridge", type: "placeholder" },
  { key: "tongtong", label: "🕊 기능순 - 통통순(통일순)", path: "/teams/tongtong", type: "placeholder" },
  { key: "praise", label: "🎶 기능순 - 찬양순", path: "/teams/praise", type: "placeholder" },
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

function MinutesPage() {
  return (
    <DocHub
      title="📝 대순장 회의록 (구글닥스)"
      editUrl={MINUTES_EDIT_URL}
      embedUrl={MINUTES_EMBED_URL}
      buttonLabel="구글문서 열기 →"
    />
  );
}

function FamilyGroupPage({ groups, onUpdateGroup }) {
  const { groupId } = useParams();
  const group = groups.find((g) => g.id === groupId);

  const [editing, setEditing] = useState(false);
  const [leader, setLeader] = useState(group?.leader ?? "");
  const [subLeadersText, setSubLeadersText] = useState(group?.subLeaders.join(", ") ?? "");
  const [membersBlock1, setMembersBlock1] = useState(group?.membersBlock1 ?? "");
  const [membersBlock2, setMembersBlock2] = useState(group?.membersBlock2 ?? "");
  const [notesText, setNotesText] = useState((group?.notes ?? []).join("\n"));

  useEffect(() => {
    if (!group) return;
    setEditing(false);
    setLeader(group.leader);
    setSubLeadersText(group.subLeaders.join(", "));
    setMembersBlock1(group.membersBlock1);
    setMembersBlock2(group.membersBlock2);
    setNotesText((group.notes ?? []).join("\n"));
  }, [groupId, group]);

  if (!group) {
    return <Navigate to="/family" replace />;
  }

  const handleSave = () => {
    const subLeaders = subLeadersText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const notes = notesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    onUpdateGroup(group.id, {
      leader: leader.trim() || group.leader,
      subLeaders,
      membersBlock1: membersBlock1.trim(),
      membersBlock2: membersBlock2.trim(),
      notes,
    });
    setEditing(false);
  };

  return (
    <PageFrame title={group.title}>
      <div className="card">
        <div className="cardSub">리더십</div>
        {editing ? (
          <>
            <div style={{ marginTop: 8 }}>
              <div className="small">가족순장</div>
              <input
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="small">부가족순장 (쉼표로 구분)</div>
              <input
                value={subLeadersText}
                onChange={(e) => setSubLeadersText(e.target.value)}
                style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
              />
            </div>
          </>
        ) : (
          <ul className="list">
            <li>가족순장: {group.leader}</li>
            {group.subLeaders.length > 0 && <li>부가족순장: {group.subLeaders.join(", ")}</li>}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="cardSub">구성원</div>
        {editing ? (
          <>
            <div>
              <div className="small">라인 1</div>
              <textarea
                value={membersBlock1}
                onChange={(e) => setMembersBlock1(e.target.value)}
                rows={2}
                style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="small">라인 2 (선택)</div>
              <textarea
                value={membersBlock2}
                onChange={(e) => setMembersBlock2(e.target.value)}
                rows={2}
                style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
              />
            </div>
          </>
        ) : (
          <ul className="list">
            {group.membersBlock1 && <li>{group.membersBlock1}</li>}
            {group.membersBlock2 && <li>{group.membersBlock2}</li>}
          </ul>
        )}
      </div>

      <div className="card">
        <div className="cardSub">메모</div>
        {editing ? (
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd", resize: "vertical" }}
          />
        ) : group.notes.length > 0 ? (
          <ul className="list">
            {group.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : (
          <div className="cardHint">아직 메모가 없습니다. 편집을 눌러 메모를 추가해 주세요.</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {editing ? (
          <>
            <button onClick={() => setEditing(false)}>취소</button>
            <button onClick={handleSave}>저장</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>편집</button>
        )}
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
            다음 단계: 각 메뉴에 구글 시트/닥스 "웹에 게시" 링크를 넣고, iframe 임베드로 바로 보여주기.
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

function Sidebar({ onNavigate, familyGroups }) {
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
        {familyGroups.map((g) => (
          <NavLink
            key={g.id}
            to={`/family/${g.id}`}
            className={({ isActive }) => "navItem navItemSub" + (isActive ? " active" : "")}
            onClick={onNavigate}
          >
            {g.title}
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
  const [familyGroups, setFamilyGroups] = useState(() => {
    try {
      const saved = window.localStorage.getItem("ccc-family-groups-v1");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return FAMILY_GROUPS_INITIAL;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("ccc-family-groups-v1", JSON.stringify(familyGroups));
    } catch {
      // ignore
    }
  }, [familyGroups]);

  const handleUpdateFamilyGroup = (id, patch) => {
    setFamilyGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    );
  };

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
        <Sidebar onNavigate={() => setMobileOpen(false)} familyGroups={familyGroups} />
      </div>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/manpower" element={<ManpowerPage />} />

          <Route
            path="/minutes"
            element={
              <MinutesPage />
            }
          />

          <Route path="/family" element={<Placeholder title="👨‍👩‍👧 가족순별 맨파워" />} />
          <Route
            path="/family/:groupId"
            element={<FamilyGroupPage groups={familyGroups} onUpdateGroup={handleUpdateFamilyGroup} />}
          />
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
