import express from 'express';
import {
  getAllPolicies,
  getPolicyPreview,
  finalizePolicy,
  updatePolicy
} from '../controllers/policyController.js';

const router = express.Router();

// View all finalized policies
router.get('/', getAllPolicies);

// Get preview data from confirmation (before finalizing)
router.get('/preview/:id', getPolicyPreview);

// Finalize confirmation as policy
router.post('/finalize/:id', finalizePolicy);

// Update finalized policy
router.put('/:id', updatePolicy);

export default router;
