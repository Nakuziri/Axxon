"use client";
import { ChevronLeft, ChevronRight, LayoutDashboard, Plus } from "lucide-react";
import Dashboard from "@/components/features/dashboard/BoardList";
import Link from "next/link";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  return (
    <div
      className={`bg-gray-900 text-white flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 ${
        collapsed ? "w-16" : "w-70"
      }`}
    >
      {/* Toggle Button */}
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

      {/* Menu Items */}
      <div className="flex-1 mt-4 space-y-2 overflow-auto">
        {/* Dashboard link with two icons */}
        <div className="transition-all duration-300 delay-200">
          <Link href="/dashboard">
            <SidebarItem collapsed={collapsed} label="Dashboard" />
          </Link>
        </div>

        {/* BoardList only when expanded */}
        {!collapsed && (
          <div className="transition-all duration-300 delay-200">
            <div className="mt-2">
              <Dashboard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-5 h-5" />
        {!collapsed && <span className="whitespace-nowrap">{label}</span>}
      </div>
      {!collapsed && <Plus className="w-4 h-4 text-gray-400" />}
    </div>
  );
}
