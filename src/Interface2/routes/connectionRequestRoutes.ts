import { Router } from 'express';
import { connectionRequestController } from '../../Containers/ConnectionContainer';


const router = Router();

router.post('/',connectionRequestController.createConnectionRequest);

router.get('/user/all-connections/:userId', connectionRequestController.getAllConnectionsByUserId);
router.get('/to-user/:userId', connectionRequestController.getAllConnectionRequestsForUser);

router.get('/recommendations/:userId', connectionRequestController.getRecommendationsForUser);

router.get('/from-user/:userId', connectionRequestController.getAllConnectionRequestsSentByUser);
// Route to get a connection request by its ID
router.get('/:id', connectionRequestController.getConnectionRequestById);

// Route to accept a connection request by its ID
router.put('/:id/accept', connectionRequestController.acceptConnectionRequest);

// Route to reject a connection request by its ID
router.put('/:id/reject', connectionRequestController.rejectConnectionRequest);

// Route to delete a connection request by its ID
router.delete('/:id', connectionRequestController.deleteConnectionRequest);

export default router;
