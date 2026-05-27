"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const [listResponse, countResponse] = await Promise.all([
      apiClient.notifications.list(token),
      apiClient.notifications.unreadCount(token),
    ]);

    if (!listResponse.success) {
      setError(listResponse.error || "Failed to load notifications");
    } else {
      setNotifications((listResponse.notifications || []) as NotificationItem[]);
      setError("");
    }

    if (countResponse.success) {
      setUnreadCount(countResponse.unreadCount || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const unreadItems = useMemo(() => notifications.filter((notification) => !notification.isRead), [notifications]);

  const handleMarkRead = async (id: string) => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSavingId(id);
    const response = await apiClient.notifications.markRead(token, id);
    if (response.success) {
      await loadNotifications();
    } else {
      setError(response.error || "Unable to mark notification as read");
    }
    setSavingId(null);
  };

  const handleMarkAllRead = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setMarkingAll(true);
    const response = await apiClient.notifications.markAllRead(token);
    if (response.success) {
      await loadNotifications();
    } else {
      setError(response.error || "Unable to mark notifications as read");
    }
    setMarkingAll(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin</p>
            <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Notification center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Track vendor approvals, lead activity, quote requests, and system updates in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll || unreadCount === 0}
              className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {markingAll ? "Clearing..." : `Mark all read (${unreadCount})`}
            </button>
            <Link href="/admin/dashboard" className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Unread" value={String(unreadCount)} tone="bg-amber-50 text-amber-900" />
        <SummaryCard label="Recent" value={String(notifications.length)} tone="bg-slate-50 text-slate-900" />
        <SummaryCard label="Priority" value={String(unreadItems.filter((item) => item.priority === "HIGH").length)} tone="bg-rose-50 text-rose-900" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-3xl border p-5 shadow-sm transition ${notification.isRead ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50/70"}`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 ring-1 ring-slate-200">
                      {notification.type}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 ring-1 ring-slate-200">
                      {notification.priority}
                    </span>
                    {notification.isRead ? <span className="text-xs font-semibold text-emerald-700">Read</span> : <span className="text-xs font-semibold text-amber-700">Unread</span>}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950">{notification.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{notification.message}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {!notification.isRead ? (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      disabled={savingId === notification.id}
                      className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {savingId === notification.id ? "Saving..." : "Mark read"}
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          {!notifications.length ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-600">
              No notifications yet. New activity from vendors, leads, quotes, and uploads will appear here.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-3xl border border-slate-200 px-5 py-4 shadow-sm ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
