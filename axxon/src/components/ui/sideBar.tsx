"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

import Dashboard from "@/components/features/dashboard/BoardList";
import Modal from "@/components/ui/Modal";
import CreateBoardForm from "@/components/forms/createBoardForm";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  // -------------------------------
  // State
  // -------------------------------
  const [isCreateBoardOpen, setCreateBoardOpen] = useState(false);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div
      className={`bg-gray-900 text-white flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 scrollbar-hidden ${
        collapsed ? "w-16" : "w-70"
      }`}
    >
      {/* -------------------------------
          Toggle Sidebar Button
      ------------------------------- */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 m-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 transition-transform duration-300" />
        ) : (
          <ChevronLeft className="w-5 h-5 transition-transform duration-300" />
        )}
      </button>

      {/* -------------------------------
          Sidebar Menu
      ------------------------------- */}
      <div className="flex-1 mt-4 space-y-2 overflow-auto">
        {/* Dashboard Link + Create Button */}
        <SidebarItem
          collapsed={collapsed}
          label="Dashboard"
          onPlusClick={() => setCreateBoardOpen(true)}
        />

        {/* Board List (only visible when sidebar is expanded) */}
        {!collapsed && (
          <div className="transition-all duration-300 delay-200 mt-2">
            <Dashboard />
          </div>
        )}
      </div>

      {/* -------------------------------
          Create Board Modal
      ------------------------------- */}
      <Modal
        isOpen={isCreateBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
        title="Create New Board"
      >
        <CreateBoardForm
          onClose={() => setCreateBoardOpen(false)}
          onSuccess={() => {
            // Optionally refetch boards (React Query integration point)
          }}
        />
      </Modal>
    </div>
  );
}

// -------------------------------
// Sidebar Item Component
// -------------------------------
interface SidebarItemProps {
  label: string;
  collapsed: boolean;
  onPlusClick?: () => void;
}

function SidebarItem({ label, collapsed, onPlusClick }: SidebarItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition-colors">
      {/* Left: Icon + Label (wrapped in Link) */}
      <Link href="/dashboard" className="flex items-center gap-3 flex-1">
        <LayoutDashboard className="w-5 h-5" />
        {!collapsed && <span className="whitespace-nowrap">{label}</span>}
      </Link>

      {/* Right: Plus Button (no Link) */}
      {!collapsed && onPlusClick && (
        <Plus
          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
          onClick={(e) => {
            e.preventDefault(); // Prevent Link navigation
            e.stopPropagation(); // Stop bubbling to parent
            onPlusClick();
          }}
        />
      )}
    </div>
  );
}
