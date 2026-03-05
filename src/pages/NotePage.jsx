import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

const NOTE_STORAGE_KEY = "ccc-page-notes-v1";

function readSavedNotes() {
  try {
    const saved = window.localStorage.getItem(NOTE_STORAGE_KEY);
    if (!saved) {
      return {};
    }
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function NotePage({ editMode }) {
  const { noteId } = useParams();
  const [notesById, setNotesById] = useState(() => readSavedNotes());

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notesById));
    } catch {
      // ignore
    }
  }, [notesById]);

  const currentHtml = useMemo(() => {
    if (!noteId) {
      return "";
    }
    return notesById[noteId] ?? "";
  }, [notesById, noteId]);

  if (!noteId) {
    return <Navigate to="/" replace />;
  }

  const handleInput = (event) => {
    const nextHtml = event.currentTarget.innerHTML;
    setNotesById((prev) => ({
      ...prev,
      [noteId]: nextHtml,
    }));
  };

  return (
    <div className="notePage">
      <div className="noteToolbar">
        <strong>노트</strong>
        <span className="small">{editMode ? "편집 가능" : "읽기 전용"}</span>
      </div>

      {editMode ? (
        <div
          className="noteEditor"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      ) : (
        <div
          className="noteViewer"
          dangerouslySetInnerHTML={{
            __html: currentHtml || "<p class='small'>아직 작성된 내용이 없습니다.</p>",
          }}
        />
      )}
    </div>
  );
}
