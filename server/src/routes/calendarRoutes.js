import express from "express";
import { getCalendarEvents } from "../controllers/calendarController.js";

const router = express.Router();

router.get("/", getCalendarEvents);

export default router;