import { Response } from "express";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

function resolveProductOwnerFilter(req: AuthRequest): Prisma.ProductWhereInput | null {
  if (req.vendorId) return { vendorId: req.vendorId };
  if (req.adminId) return { adminId: req.adminId };
  return null;
}

export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, brand, type, efficiency, warranty, wattage, description, image } =
      req.body;

    if (!title || !brand || !type || efficiency === undefined || !warranty || !wattage) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const product = await prisma.product.create({
      data: {
        title,
        brand,
        type,
        efficiency,
        warranty: parseInt(warranty),
        wattage: parseInt(wattage),
        description,
        image,
        ...(req.vendorId ? { vendorId: req.vendorId } : { adminId: req.adminId }),
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const products = await prisma.product.findMany({
      where: ownerFilter,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, ...ownerFilter },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const { title, brand, type, efficiency, warranty, wattage, description, image } =
      req.body;

    const product = await prisma.product.findFirst({
      where: { id, ...ownerFilter },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(brand && { brand }),
        ...(type && { type }),
        ...(efficiency !== undefined && { efficiency }),
        ...(warranty && { warranty: parseInt(warranty) }),
        ...(wattage && { wattage: parseInt(wattage) }),
        ...(description && { description }),
        ...(image && { image }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: { id, ...ownerFilter },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerFilter = resolveProductOwnerFilter(req);

    if (!ownerFilter) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const totalProducts = await prisma.product.count({
      where: ownerFilter,
    });

    const recentProducts = await prisma.product.findMany({
      where: ownerFilter,
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories: 0, // Placeholder - can be expanded
        recentActivity: recentProducts,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
