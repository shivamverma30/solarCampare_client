"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  createdAt: string;
  isRead: boolean;
};

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.notifications.list(token);
      if (response.success && Array.isArray(response.notifications)) {
        setNotifications(response.notifications as NotificationItem[]);
      }
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Notifications</h1>
      <div className="space-y-3">
        {notifications.map((item) => (
          <article key={item.id} className={`rounded-xl border px-4 py-3 ${item.isRead ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50"}`}>
            <p className="font-semibold text-slate-900">{item.title}</p>
            <p className="mt-1 text-sm text-slate-600">{item.body || "No details"}</p>
            <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
