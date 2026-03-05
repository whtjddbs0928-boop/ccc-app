import { Routes, Route, NavLink, Navigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DocHub } from "./components/Dochub";
import {
  CCC_CALENDAR_EMBED_URL,
  CCC_CALENDAR_OPEN_URL,
  MINUTES_EDIT_URL,
  MINUTES_EMBED_URL,
} from "./config/docs";
import { ManpowerPage } from "./pages/Manpower";
import { NotePage } from "./pages/NotePage";

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

const EDIT_MODE_KEY = "ccc-edit-mode";
const PAGES_STORAGE_KEY = "ccc-pages-v1";
const FAMILY_GROUPS_STORAGE_KEY = "ccc-family-groups-v1";

const PAGES_INITIAL = [
  { id: "manpower", title: "📊 맨파워 (구글시트)", path: "/manpower", type: "link", fixed: true },
  { id: "minutes", title: "📝 대순장 회의록 (구글닥스)", path: "/minutes", type: "link", fixed: true },
  { id: "family", title: "👨‍👩‍👧 가족순별 맨파워", path: "/family", type: "placeholder", fixed: true },
  { id: "curriculum", title: "📚 가족순별 커리큘럼", path: "/curriculum", type: "placeholder", fixed: true },
  { id: "schedule", title: "📅 CCC 전체 일정표", path: "/schedule", type: "placeholder", fixed: true },
  { id: "bridge", title: "🌉 기능순 - 브릿지순", path: "/teams/bridge", type: "placeholder", fixed: true },
  { id: "tongtong", title: "🕊 기능순 - 통통순(통일순)", path: "/teams/tongtong", type: "placeholder", fixed: true },
  { id: "praise", title: "🎶 기능순 - 찬양순", path: "/teams/praise", type: "placeholder", fixed: true },
];

function readLocalStorageJSON(key, fallbackValue) {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) {
      return fallbackValue;
    }
    return JSON.parse(saved);
  } catch {
    return fallbackValue;
  }
}

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

function FamilyGroupPage({ groups, onUpdateGroup, editMode }) {
  const { groupId } = useParams();
  const group = groups.find((g) => g.id === groupId);

  const [editing, setEditing] = useState(false);
  const [groupTitle, setGroupTitle] = useState(group?.title ?? "");
  const [leader, setLeader] = useState(group?.leader ?? "");
  const [subLeadersText, setSubLeadersText] = useState(group?.subLeaders.join(", ") ?? "");
  const [membersBlock1, setMembersBlock1] = useState(group?.membersBlock1 ?? "");
  const [membersBlock2, setMembersBlock2] = useState(group?.membersBlock2 ?? "");
  const [notesText, setNotesText] = useState((group?.notes ?? []).join("\n"));

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
      title: groupTitle.trim() || group.title,
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
        <div className="cardSub">이름</div>
        {editing ? (
          <input
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            style={{ width: "100%", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          />
        ) : (
          <div style={{ marginTop: 8 }}>{group.title}</div>
        )}
      </div>

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
        {editMode &&
          (editing ? (
            <>
              <button onClick={() => setEditing(false)}>취소</button>
              <button onClick={handleSave}>저장</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>편집</button>
          ))}
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

function Sidebar({
  onNavigate,
  familyGroups,
  pages,
  editMode,
  onToggleEditMode,
  onRenamePage,
  onAddCategory,
}) {
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const documentPageIds = ["manpower", "minutes"];
  const familyPageIds = ["family", "curriculum", "schedule"];
  const teamPageIds = ["bridge", "tongtong", "praise"];

  const documentPages = pages.filter((page) => documentPageIds.includes(page.id));
  const familyPages = pages.filter((page) => familyPageIds.includes(page.id));
  const teamPages = pages.filter((page) => teamPageIds.includes(page.id));
  const notePages = pages.filter((page) => page.type === "note");

  const beginRename = (page) => {
    setEditingPageId(page.id);
    setEditingTitle(page.title);
  };

  const commitRename = (page) => {
    const nextTitle = editingTitle.trim() || page.title;
    onRenamePage(page.id, nextTitle);
    setEditingPageId(null);
    setEditingTitle("");
  };

  const renderPageLink = (page, extraClassName = "") => (
    <div className="navItemRow" key={page.id}>
      <NavLink
        to={page.path}
        className={({ isActive }) => "navItem" + (extraClassName ? ` ${extraClassName}` : "") + (isActive ? " active" : "")}
        onClick={onNavigate}
      >
        {editingPageId === page.id ? (
          <input
            className="navTitleInput"
            value={editingTitle}
            autoFocus
            onClick={(e) => e.preventDefault()}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={() => commitRename(page)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitRename(page);
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setEditingPageId(null);
                setEditingTitle("");
              }
            }}
          />
        ) : (
          page.title
        )}
      </NavLink>
      {editMode && (
        <button
          type="button"
          className="navEditBtn"
          aria-label={`${page.title} 이름 수정`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            beginRename(page);
          }}
        >
          ✎
        </button>
      )}
    </div>
  );

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
        <button type="button" className="editModeToggle" onClick={onToggleEditMode}>
          {editMode ? "편집 모드 ON" : "편집 모드 OFF"}
        </button>

        <NavLink to="/" end className={({ isActive }) => "navItem" + (isActive ? " active" : "")} onClick={onNavigate}>
          🏠 홈
        </NavLink>

        <div className="navSection">문서</div>
        {documentPages.map((page) => renderPageLink(page))}

        <div className="navSection">가족순</div>
        {familyPages.map((page) => renderPageLink(page))}
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
        {teamPages.map((page) => renderPageLink(page))}

        {notePages.length > 0 && <div className="navSection">노트</div>}
        {notePages.map((page) => renderPageLink(page))}
      </nav>

      <div className="sidebarFooter">
        <div className="small">v0.1</div>
        <div className="small">PWA • iPhone Safari</div>
      </div>
      {editMode && (
        <div>
          <button type="button" className="sidebarAddBtn" onClick={onAddCategory}>
            + 카테고리 추가
          </button>
        </div>
      )}
    </aside>
  );
}

function getPageTitleByPath(pages, path, fallbackTitle) {
  const found = pages.find((page) => page.path === path);
  return found?.title ?? fallbackTitle;
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editMode, setEditMode] = useState(() => {
    const saved = readLocalStorageJSON(EDIT_MODE_KEY, false);
    return Boolean(saved);
  });
  const [pages, setPages] = useState(() => {
    const saved = readLocalStorageJSON(PAGES_STORAGE_KEY, PAGES_INITIAL);
    return Array.isArray(saved) ? saved : PAGES_INITIAL;
  });
  const [familyGroups, setFamilyGroups] = useState(() => {
    const saved = readLocalStorageJSON(FAMILY_GROUPS_STORAGE_KEY, FAMILY_GROUPS_INITIAL);
    return Array.isArray(saved) ? saved : FAMILY_GROUPS_INITIAL;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(EDIT_MODE_KEY, JSON.stringify(editMode));
    } catch {
      // ignore
    }
  }, [editMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
    } catch {
      // ignore
    }
  }, [pages]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAMILY_GROUPS_STORAGE_KEY, JSON.stringify(familyGroups));
    } catch {
      // ignore
    }
  }, [familyGroups]);

  const handleUpdateFamilyGroup = (id, patch) => {
    setFamilyGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    );
  };

  const handleRenamePage = (id, title) => {
    setPages((prev) =>
      prev.map((page) => (page.id === id ? { ...page, title } : page)),
    );
  };

  const handleAddCategory = () => {
    const id = `note-${Date.now()}`;
    const newPage = {
      id,
      title: "새 노트",
      path: `/notes/${id}`,
      type: "note",
      fixed: false,
    };
    setPages((prev) => [...prev, newPage]);
  };

  const location = useLocation();
  const isFullBleed = ["/manpower", "/minutes", "/schedule"].includes(location.pathname);

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
        <Sidebar
          onNavigate={() => setMobileOpen(false)}
          familyGroups={familyGroups}
          pages={pages}
          editMode={editMode}
          onToggleEditMode={() => setEditMode((prev) => !prev)}
          onRenamePage={handleRenamePage}
          onAddCategory={handleAddCategory}
        />
      </div>

      <main className={"main" + (isFullBleed ? " main--fullBleed" : "")}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/manpower" element={<ManpowerPage />} />

          <Route
            path="/minutes"
            element={
              <MinutesPage />
            }
          />

          <Route
            path="/family"
            element={<Placeholder title={getPageTitleByPath(pages, "/family", "👨‍👩‍👧 가족순별 맨파워")} />}
          />
          <Route
            path="/family/:groupId"
            element={
              <FamilyGroupPage
                key={location.pathname}
                groups={familyGroups}
                onUpdateGroup={handleUpdateFamilyGroup}
                editMode={editMode}
              />
            }
          />
          <Route
            path="/curriculum"
            element={<Placeholder title={getPageTitleByPath(pages, "/curriculum", "📚 가족순별 커리큘럼")} />}
          />
          <Route
            path="/schedule"
            element={
              <DocHub
                title={getPageTitleByPath(pages, "/schedule", "📅 CCC 전체 일정표 (Google Calendar)")}
                editUrl={CCC_CALENDAR_OPEN_URL}
                embedUrl={CCC_CALENDAR_EMBED_URL}
                buttonLabel="구글캘린더 열기 →"
              />
            }
          />

          <Route
            path="/teams/bridge"
            element={<Placeholder title={getPageTitleByPath(pages, "/teams/bridge", "🌉 기능순 - 브릿지순")} />}
          />
          <Route
            path="/teams/tongtong"
            element={<Placeholder title={getPageTitleByPath(pages, "/teams/tongtong", "🕊 기능순 - 통통순(통일순)")} />}
          />
          <Route
            path="/teams/praise"
            element={<Placeholder title={getPageTitleByPath(pages, "/teams/praise", "🎶 기능순 - 찬양순")} />}
          />

          <Route path="/notes/:noteId" element={<NotePage editMode={editMode} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
