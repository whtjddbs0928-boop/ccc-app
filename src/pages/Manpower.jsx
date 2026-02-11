import { DocHub } from "../components/Dochub";
import { MANPOWER_EDIT_URL, MANPOWER_EMBED_URL } from "../config/docs";

export function ManpowerPage() {
  return (
    <DocHub
      title="📊 맨파워 (구글시트)"
      editUrl={MANPOWER_EDIT_URL}
      embedUrl={MANPOWER_EMBED_URL}
      buttonLabel="구글시트 열기 →"
    />
  );
}
