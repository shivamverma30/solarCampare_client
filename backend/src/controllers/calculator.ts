import { Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const saveCalculatorHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "User authentication required" });
      return;
    }

    const { calculatorType, inputs, outputs } = req.body as {
      calculatorType?: string;
      inputs?: unknown;
      outputs?: unknown;
    };

    if (!calculatorType || !inputs || !outputs) {
      res.status(400).json({ error: "calculatorType, inputs, and outputs are required" });
      return;
    }

    const history = await prisma.calculatorHistory.create({
      data: {
        userId: req.userId,
        calculatorType,
        inputs: inputs as never,
        outputs: outputs as never,
      },
    });

    res.status(201).json({ success: true, history });
  } catch (error) {
    console.error("Save calculator history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listCalculatorHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "User authentication required" });
      return;
    }

    const history = await prisma.calculatorHistory.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("List calculator history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
