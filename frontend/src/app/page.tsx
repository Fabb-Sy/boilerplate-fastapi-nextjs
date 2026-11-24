"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/services/api-client";
import { TaskItem } from "@/types/api";
import { Play, RefreshCw, Terminal, CheckCircle2, Cpu } from "lucide-react";

export default function StudioPage() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHealthAndTasks = async () => {
    const health = await api.getHealth();
    setIsHealthy(health.success);

    const tasksRes = await api.listTasks();
    if (tasksRes.success && tasksRes.data) {
      setTasks(tasksRes.data);
    }
  };

  useEffect(() => {
    fetchHealthAndTasks();
    const interval = setInterval(fetchHealthAndTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setLoading(true);
    const res = await api.createTask(taskTitle, {
      sample_rate: 44100,
      render_engine: "ffmpeg-v6",
    });
    setLoading(false);

    if (res.success && res.data) {
      setTasks((prev) => [res.data!, ...prev]);
      setTaskTitle("");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar isHealthy={isHealthy} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-6 sm:p-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="h-3.5 w-3.5" /> AI & Media Processing Studio Starter
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Lean Fullstack Architecture
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              FastAPI backend dengan task pipeline asinkron dan Next.js 15 UI terhubung via standard response envelope. Siap di-scale untuk media clipper, audio transcriber, atau AI agent.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Create Task */}
          <div className="lg:col-span-1">
            <Card title="Enqueue New Pipeline Job" subtitle="Test the asynchronous worker flow">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Job / Task Title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Generate TikTok Subtitle Clip"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <span className="text-indigo-400">POST /api/v1/tasks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pipeline Stages:</span>
                    <span className="text-amber-400">PENDING → PROCESSING → COMPLETED</span>
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Dispatch Task
                </Button>
              </form>
            </Card>
          </div>

          {/* Task Queue Dashboard */}
          <div className="lg:col-span-2">
            <Card
              title="Active Task Queue"
              subtitle="Real-time polling from in-memory TaskService"
            >
              {tasks.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                  <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks currently queued. Enqueue one from the left!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm text-zinc-200">{task.title}</h4>
                          <span className="text-[11px] font-mono text-zinc-500">ID: {task.id}</span>
                        </div>
                        <Badge status={task.status} />
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-500"
                              : task.status === "FAILED"
                              ? "bg-rose-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>

                      {task.result && (
                        <div className="text-xs bg-zinc-900/60 p-2.5 rounded border border-zinc-800 font-mono text-zinc-400 flex items-center justify-between">
                          <span>Output: {task.result.output_file}</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        FastAPI Next.js Studio Skeleton • Clean Architecture & Standard Response Envelope
      </footer>
    </div>
  );
}
