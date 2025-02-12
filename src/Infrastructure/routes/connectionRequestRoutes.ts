import { Router } from "express";
import {
  createConnectionRequest,
  getConnectionRequestById,
  acceptConnectionRequest,
  rejectConnectionRequest,
  deleteConnectionRequest,
  getAllConnectionRequestsForUser,
  getAllConnectionRequestsSentByUser,
  getAllConnectionsByUserId,
  getRecommendationsForUser,
} from "../controller/connectionRequest/connectionRequestController";

const router = Router();

router.post("/", createConnectionRequest);

router.get("/user/all-connections/:userId", getAllConnectionsByUserId);
router.get("/to-user/:userId", getAllConnectionRequestsForUser);

router.get("/recommendations/:userId", getRecommendationsForUser);

router.get("/from-user/:userId", getAllConnectionRequestsSentByUser);
// Route to get a connection request by its ID
router.get("/:id", getConnectionRequestById);

// Route to accept a connection request by its ID
router.put("/:id/accept", acceptConnectionRequest);

// Route to reject a connection request by its ID
router.put("/:id/reject", rejectConnectionRequest);

// Route to delete a connection request by its ID
router.delete("/:id", deleteConnectionRequest);

export default router;
