import React from "react";
import { TaskStatus } from "@/types/api";

export const Badge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles: Record<TaskStatus, string> = {
    PENDING: "bg-zinc-800 text-zinc-300 border-zinc-700",
    PROCESSING: "bg-amber-950/70 text-amber-300 border-amber-800 animate-pulse",
    COMPLETED: "bg-emerald-950/70 text-emerald-300 border-emerald-800",
    FAILED: "bg-rose-950/70 text-rose-300 border-rose-800",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};
