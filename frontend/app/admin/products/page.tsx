"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

interface Product {
  id: string;
  title: string;
  brand: string;
  type: string;
  efficiency: number;
  warranty: number;
  wattage: number;
  description: string;
  image?: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    type: "",
    efficiency: "",
    warranty: "",
    wattage: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const response = await apiClient.products.getAll(token);

    if (!response.success) {
      setError(response.error || "Failed to fetch products");
    } else {
      setProducts((response.products as Product[]) || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    if (editingId) {
      const response = await apiClient.products.update(token, editingId, formData);
      if (response.success) {
        setProducts(
          products.map((p) => (p.id === editingId ? (response.product as Product) : p))
        );
        resetForm();
      } else {
        setError(response.error || "Failed to update product");
      }
    } else {
      const response = await apiClient.products.create(token, formData);
      if (response.success) {
        setProducts([(response.product as Product), ...products]);
        resetForm();
      } else {
        setError(response.error || "Failed to create product");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      brand: product.brand,
      type: product.type,
      efficiency: product.efficiency.toString(),
      warranty: product.warranty.toString(),
      wattage: product.wattage.toString(),
      description: product.description,
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const token = getToken();
    if (!token) return;

    setDeleting(id);
    const response = await apiClient.products.delete(token, id);

    if (response.success) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      setError(response.error || "Failed to delete product");
    }

    setDeleting(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: "",
      type: "",
      efficiency: "",
      warranty: "",
      wattage: "",
      description: "",
      image: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">
            Products
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your solar products catalog
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg border border-amber-300/80 bg-amber-400 px-6 py-2 font-semibold text-black transition hover:bg-amber-300"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-serif font-bold text-slate-900">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Product Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Panel Type (e.g., Monocrystalline)"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Efficiency (%)"
                step="0.1"
                value={formData.efficiency}
                onChange={(e) =>
                  setFormData({ ...formData, efficiency: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="number"
                placeholder="Warranty (Years)"
                value={formData.warranty}
                onChange={(e) =>
                  setFormData({ ...formData, warranty: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Wattage (W)"
                value={formData.wattage}
                onChange={(e) =>
                  setFormData({ ...formData, wattage: e.target.value })
                }
                required
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
              rows={4}
            />

            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-amber-400"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black transition hover:bg-amber-300"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm"
            >
              <div className="h-4 w-40 rounded bg-slate-300"></div>
              <div className="mt-2 h-3 w-20 rounded bg-slate-300"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white/90 p-12 text-center shadow-sm">
          <span className="text-4xl">📦</span>
          <p className="mt-4 text-slate-600">
            No products yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {product.brand} • {product.type} • {product.efficiency}% efficiency • {product.wattage}W
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
