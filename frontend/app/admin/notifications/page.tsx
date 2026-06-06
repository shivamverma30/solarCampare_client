"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  description?: string;
  type: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
  audience?: string;
  metadata?: Record<string, unknown> | null;
  adminId?: string | null;
  userId?: string | null;
  vendorId?: string | null;
  readAt?: string | null;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

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

  const handleDelete = async (id: string) => {

      const closeModal = () => setSelectedNotification(null);
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!confirm("Delete this notification? This action cannot be undone.")) return;

    setSavingId(id);
    const response = await apiClient.notifications.delete(token, id);
    if (response.success) {
      await loadNotifications();
    } else {
      setError(response.error || "Unable to delete notification");
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
              role="button"
              tabIndex={0}
              onClick={() => setSelectedNotification(notification)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedNotification(notification);
                }
              }}
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
                  <p className="mt-2 text-sm leading-7 text-slate-600">{notification.description || notification.message}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {!notification.isRead ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleMarkRead(notification.id);
                      }}
                      disabled={savingId === notification.id}
                      className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {savingId === notification.id ? "Saving..." : "Mark read"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleDelete(notification.id);
                    }}
                    disabled={savingId === notification.id}
                    className="inline-flex h-10 items-center rounded-full border border-red-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:opacity-60"
                  >
                    {savingId === notification.id ? "Deleting..." : "Delete"}
                  </button>
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

      {selectedNotification ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Notification details</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedNotification.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedNotification(null)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-92px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailField label="Type" value={selectedNotification.type} />
                <DetailField label="Priority" value={selectedNotification.priority} />
                <DetailField label="Audience" value={selectedNotification.audience || "ADMIN"} />
                <DetailField label="Status" value={selectedNotification.isRead ? "Read" : "Unread"} />
                <DetailField label="Created" value={new Date(selectedNotification.createdAt).toLocaleString()} />
                <DetailField label="Read at" value={selectedNotification.readAt ? new Date(selectedNotification.readAt).toLocaleString() : "Not read"} />
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{selectedNotification.description || selectedNotification.message}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Metadata</p>
                  <pre className="mt-2 overflow-x-auto text-xs leading-6 text-slate-700">{JSON.stringify(selectedNotification.metadata || {}, null, 2)}</pre>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <DetailField label="Admin ID" value={selectedNotification.adminId || "-"} />
                  <DetailField label="User ID" value={selectedNotification.userId || "-"} />
                  <DetailField label="Vendor ID" value={selectedNotification.vendorId || "-"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
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

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-950 break-all">{value}</p>
    </div>
  );
}
