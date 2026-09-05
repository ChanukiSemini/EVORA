// routes/driverRoutes.js
import express from 'express';
import { getDriver, updateDriver, deactivateDriver } from '../controllers/driverController.js';

const router = express.Router();

router.get('/:id', getDriver);
router.patch('/:id', updateDriver);
router.patch('/:id/deactivate', deactivateDriver);

export default router;