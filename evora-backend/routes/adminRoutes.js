const express = require('express')
const router = express.Router()
const {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  updateBranchStatus,
  registerHardware,
  updatePortStatus,
  removePort,
  getCases,
  getCaseById,
  updateCaseStatus,
  getReports,
} = require('../controllers/adminController')
const { protectAdmin } = require('../middleware/adminMiddleware')

// Branch & Infrastructure Routes
router.route('/branches').get(protectAdmin, getBranches).post(protectAdmin, createBranch)
router.route('/branches/:branchId').put(protectAdmin, updateBranch).delete(protectAdmin, deleteBranch)
router.route('/branches/:branchId/status').patch(protectAdmin, updateBranchStatus)
router.route('/branches/:branchId/chargers').post(protectAdmin, registerHardware)
router
  .route('/branches/:branchId/chargers/:chargerId/ports/:portId/status')
  .patch(protectAdmin, updatePortStatus)
router
  .route('/branches/:branchId/chargers/:chargerId/ports/:portId')
  .delete(protectAdmin, removePort)

// Support & Help Desk Cases Routes
router.route('/cases').get(protectAdmin, getCases)
router
  .route('/cases/:caseId')
  .get(protectAdmin, getCaseById)
  .patch(protectAdmin, updateCaseStatus)

// Network Reports & Analytics
router.route('/reports').get(protectAdmin, getReports)

module.exports = router


