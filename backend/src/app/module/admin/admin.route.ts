import express from "express";
import adminController from "./admin.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = express.Router()

router.post('/application', authenticate, adminController.application)

router.get('/application/:client_id', adminController.applicationData)

router.get('/application', authenticate, adminController.getApplication)

router.get('/stat', authenticate, adminController.getStat)

export default router