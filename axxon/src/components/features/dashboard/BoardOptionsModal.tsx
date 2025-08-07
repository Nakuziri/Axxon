import { useEffect, useRef } from "react";
import {  UpdateBoard } from "@/lib/types/boardTypes";

type BoardOptionsModalProps = {
  board: UpdateBoard;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onInvite: () => void;
};

export default function BoardOptionsModal({
  board,
  onClose,
  onEdit,
  onDelete,
  onInvite,
}: BoardOptionsModalProps) {
  // Ref to container div to manage keyboard events and focus
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        // Trigger click on the currently focused button
        const active = document.activeElement;
        if (active && active instanceof HTMLButtonElement) {
          active.click();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    // Focus first button when modal opens for accessibility
    if (containerRef.current) {
      const firstButton = containerRef.current.querySelector("button");
      if (firstButton instanceof HTMLElement) {
        firstButton.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-options-title"
      ref={containerRef}
      tabIndex={-1} //focuseable container for keyboard events
    >
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-md text-black tracking-wide">
        <h2 id="board-options-title" className="text-xl font-semibold">
          Board Options
        </h2>
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="text-blue-600 hover:underline"
        >
          Edit Board
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this board?")) {
              onDelete();
            }
            onClose();
          }}
          className="text-red-600 hover:underline"
        >
          Delete Board
        </button>
        <button
          onClick={() => {
            onInvite();
            onClose();
          }}
          className="text-green-600 hover:underline"
        >
          Invite Members
        </button>
      </div>
    </div>
  );
}
