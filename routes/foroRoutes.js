import { Router } from "express";
import { crearPost, obtenerPosts, crearReply, obtenerReplies } from "../controllers/foroController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import upload from '../middleware/uploadMiddleware.js';
const router = Router();

router.post("/posts", authenticateToken, upload.single('archivo'), crearPost);
router.get("/posts", authenticateToken, obtenerPosts);
router.post("/reply", authenticateToken, upload.single('archivo'), crearReply);
router.get("/reply/:postId", authenticateToken, obtenerReplies);

export default router;