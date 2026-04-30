import { useState, type ElementType } from "react";
import { useAuth } from "@/lib/auth";
import { usePageContent } from "@/lib/usePageContent";

export function EditableText({
  contentKey,
  fallback,
  as: Tag = "span",
  multiline = false,
  className = "",
}: {
  contentKey: string;
  fallback: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
}) {
  const { isAdmin } = useAuth();
  const { get, update } = usePageContent();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const value = get(contentKey, fallback);

  if (editing) {
    return (
      <span className="block">
        {multiline ? (
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-[#5266c0] bg-yellow-50 p-2 text-sm font-mono"
            rows={Math.max(3, draft.split("\n").length)}
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full border border-[#5266c0] bg-yellow-50 p-1 text-sm"
          />
        )}
        <span className="mt-1 flex gap-2 text-xs">
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await update(contentKey, draft);
              setSaving(false);
              setEditing(false);
            }}
            className="border border-[#2a7] bg-[#aaffaa] px-2 py-0.5"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="border border-[#999] bg-white px-2 py-0.5"
          >
            Cancel
          </button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      className={
        className +
        (isAdmin
          ? " cursor-pointer rounded outline outline-1 outline-dashed outline-[#5266c0]/40 hover:outline-[#5266c0] hover:bg-yellow-50/60"
          : "")
      }
      onClick={
        isAdmin
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              setDraft(value);
              setEditing(true);
            }
          : undefined
      }
      title={isAdmin ? "Click to edit" : undefined}
    >
      {value}
    </Tag>
  );
}
