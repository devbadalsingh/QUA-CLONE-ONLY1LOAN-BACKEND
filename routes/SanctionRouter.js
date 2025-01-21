import express from "express";
const router = express.Router();
import { onHold, unHold, getHold } from "../Controllers/holdUnhold.js";
import { rejected, getRejected } from "../Controllers/rejected.js";
import {
    getPendingESign,
    getPendingSanctions,
    getSanction,
    recommendedApplications,
    sanctionApprove,
    sanctionPreview,
    sanctioned,
    sanctionedReport,
    sendESign,
} from "../Controllers/sanction.js";
import { eSignWebhook } from "../Controllers/eSignController.js";
import { sentBack } from "../Controllers/sentBack.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/approved").get(protect, sanctioned);
router.get("/approved/report", protect, sanctionedReport);
router.get("/pending", protect, getPendingSanctions);
router.get("/eSignPending", protect, getPendingESign);
router.get("/sendESign/:id", protect, sendESign);
router.get("/recommended", protect, recommendedApplications);
router.get("/hold", protect, getHold);
router.get("/rejected", protect, getRejected);
router.post("/esign/success", eSignWebhook);
router.get("/:id", protect, getSanction);
router.route("/hold/:id").patch(protect, onHold);
router.patch("/unhold/:id", protect, unHold);
router.get("/preview/:id", protect, sanctionPreview);
router.patch("/approve/:id", protect, sanctionApprove);
router.patch("/sent-back/:id", protect, sentBack);
router.route("/reject/:id").patch(protect, rejected);

export default router;
