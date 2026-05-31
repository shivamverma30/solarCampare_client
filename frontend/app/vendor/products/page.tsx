"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type Product = {
  id: string;
  title: string;
  brand: string;
  type: string;
  efficiency: number;
  warranty: number;
  wattage: number;
  description: string;
  image?: string;
};

const initial = {
  title: "",
  brand: "",
  type: "",
  efficiency: "",
  warranty: "",
  wattage: "",
  description: "",
  image: "",
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.products.getAll(token);
      if (response.success) {
        setProducts((response.products as Product[]) || []);
      }
    };

    void load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = getToken();
    if (!token) return;

    const response = editingId
      ? await apiClient.products.update(token, editingId, form)
      : await apiClient.products.create(token, form);

    if (!response.success) {
      setMessage(response.error || "Unable to save product");
      return;
    }

    const list = await apiClient.products.getAll(token);
    if (list.success) {
      setProducts((list.products as Product[]) || []);
    }
    setForm(initial);
    setEditingId(null);
    setMessage("Product saved successfully");
  };

  const remove = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const response = await apiClient.products.delete(token, id);
    if (!response.success) {
      setMessage(response.error || "Unable to delete product");
      return;
    }
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
      {message ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
        <Input label="Brand" value={form.brand} onChange={(value) => setForm({ ...form, brand: value })} />
        <Input label="Type" value={form.type} onChange={(value) => setForm({ ...form, type: value })} />
        <Input label="Efficiency" value={form.efficiency} onChange={(value) => setForm({ ...form, efficiency: value })} type="number" />
        <Input label="Warranty" value={form.warranty} onChange={(value) => setForm({ ...form, warranty: value })} type="number" />
        <Input label="Wattage" value={form.wattage} onChange={(value) => setForm({ ...form, wattage: value })} type="number" />
        <Input label="Image URL" value={form.image} onChange={(value) => setForm({ ...form, image: value })} />
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Description
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2" rows={4} />
        </label>
        <button type="submit" className="md:col-span-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{product.title}</p>
                <p className="text-sm text-slate-600">{product.brand} • {product.wattage}W • {product.type}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => {
                  setEditingId(product.id);
                  setForm({
                    title: product.title,
                    brand: product.brand,
                    type: product.type,
                    efficiency: String(product.efficiency),
                    warranty: String(product.warranty),
                    wattage: String(product.wattage),
                    description: product.description,
                    image: product.image || "",
                  });
                }} className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">Edit</button>
                <button type="button" onClick={() => void remove(product.id)} className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2" />
    </label>
  );
}
