import { Router, Request, Response } from "express";

const router = Router();

// Example route
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "IG App API is running",
    version: "1.0.0",
  });
});

export { router };
