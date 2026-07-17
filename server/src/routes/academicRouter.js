import express from "express";
import { getAcademicCalendar } from "../controllers/academicController.js";

const router = express.Router();

router.get("/", getAcademicCalendar);

export default router;