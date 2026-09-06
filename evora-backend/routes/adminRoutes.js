const express = require('express')
const router = express.Router()
const {
  getBranches,
  createBranch,
  updateBranch,
  updateBranchStatus,
  registerHardware,
  updatePortStatus,
  removePort,
  getCases,
  getCaseById,
  updateCaseStatus,
} = require('../controllers/adminController')
const { protectAdmin } = require('../middleware/adminMiddleware')

// Branch & Infrastructure Routes
router.route('/branches').get(protectAdmin, getBranches).post(protectAdmin, createBranch)
router.route('/branches/:branchId').put(protectAdmin, updateBranch)
router.route('/branches/:branchId/status').patch(protectAdmin, updateBranchStatus)
router.route('/branches/:branchId/chargers').post(protectAdmin, registerHardware)
router
  .route('/branches/:branchId/chargers/:chargerId/ports/:portId/status')
  .patch(protectAdmin, updatePortStatus)
router
  .route('/branches/:branchId/chargers/:chargerId/ports/:portId')
  .delete(protectAdmin, removePort)

// Support & Maintenance Cases Routes
router.route('/cases').get(protectAdmin, getCases)
router
  .route('/cases/:caseId')
  .get(protectAdmin, getCaseById)
  .patch(protectAdmin, updateCaseStatus)

module.exports = router

