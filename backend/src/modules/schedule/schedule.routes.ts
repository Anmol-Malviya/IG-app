import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validator";
import { ScheduleController } from "./schedule.controller";
import {
  createScheduleSchema,
  scheduleIdSchema,
  updateScheduleSchema,
} from "./schedule.validation";

const router = Router();

router.use(authenticate);

router.get("/", ScheduleController.getAll);
router.post("/", validate({ body: createScheduleSchema }), ScheduleController.create);
router.post(
  "/:id/duplicate",
  validate({ params: scheduleIdSchema }),
  ScheduleController.duplicate
);
router.get(
  "/:id",
  validate({ params: scheduleIdSchema }),
  ScheduleController.getById
);
router.patch(
  "/:id",
  validate({ params: scheduleIdSchema, body: updateScheduleSchema }),
  ScheduleController.update
);
router.delete(
  "/:id",
  validate({ params: scheduleIdSchema }),
  ScheduleController.delete
);

export { router as scheduleRoutes };
