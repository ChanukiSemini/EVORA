const mongoose = require('mongoose')
const Branch = require('../models/Branch')
const SupportCase = require('../models/SupportCase')

// @desc    Get all branches and hardware infrastructure
// @route   GET /api/admin/branches
// @access  Public / Admin
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({})
    res.json(branches)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Create a new charging branch/station
// @route   POST /api/admin/branches
// @access  Admin
const createBranch = async (req, res) => {
  try {
    const { branchId, name, openHours, address, phone, chargers } = req.body

    const existingBranch = await Branch.findOne({ branchId })
    if (existingBranch) {
      return res.status(400).json({ message: 'Branch ID already exists' })
    }

    const branch = await Branch.create({
      branchId,
      name,
      openHours: openHours || '24/7',
      address: address || '',
      phone: phone || '',
      chargers: chargers || [],
    })

    res.status(201).json(branch)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update branch details (name, openHours, address, phone)
// @route   PUT /api/admin/branches/:branchId
// @access  Admin
const updateBranch = async (req, res) => {
  try {
    const { branchId } = req.params
    const { name, openHours, address, phone } = req.body

    let branch = await Branch.findOne({ branchId })
    if (!branch && mongoose.Types.ObjectId.isValid(branchId)) {
      branch = await Branch.findById(branchId)
    }

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' })
    }

    if (name !== undefined) branch.name = name
    if (openHours !== undefined) branch.openHours = openHours
    if (address !== undefined) branch.address = address
    if (phone !== undefined) branch.phone = phone

    await branch.save()
    res.json({ message: 'Branch details updated', branch })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Register new hardware (chargers + ports) to a branch
// @route   POST /api/admin/branches/:branchId/chargers
// @access  Admin
const registerHardware = async (req, res) => {
  try {
    const { branchId } = req.params
    const { chargers } = req.body // Array of charger objects

    let branch = await Branch.findOne({ branchId })
    if (!branch && mongoose.Types.ObjectId.isValid(branchId)) {
      branch = await Branch.findById(branchId)
    }
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' })
    }

    // Append new chargers to existing branch chargers
    branch.chargers.push(...chargers)
    await branch.save()

    res.status(200).json({
      message: 'Hardware registered successfully',
      branch,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update status of a specific port (e.g. maintenance, available, faulty)
// @route   PATCH /api/admin/branches/:branchId/chargers/:chargerId/ports/:portId/status
// @access  Admin
const updatePortStatus = async (req, res) => {
  try {
    const { branchId, chargerId, portId } = req.params
    const { status } = req.body

    let branch = await Branch.findOne({ branchId })
    if (!branch && mongoose.Types.ObjectId.isValid(branchId)) {
      branch = await Branch.findById(branchId)
    }
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' })
    }

    const charger = branch.chargers.find(
      (c) => c.chargerId === chargerId || (c._id && c._id.toString() === chargerId)
    )
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found' })
    }

    const port = charger.ports.find(
      (p) => p.portId === portId || (p._id && p._id.toString() === portId)
    )
    if (!port) {
      return res.status(404).json({ message: 'Port not found' })
    }

    port.status = status
    await branch.save()

    res.json({ message: 'Port status updated', branch })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Decommission / remove a charger port
// @route   DELETE /api/admin/branches/:branchId/chargers/:chargerId/ports/:portId
// @access  Admin
const removePort = async (req, res) => {
  try {
    const { branchId, chargerId, portId } = req.params

    let branch = await Branch.findOne({ branchId })
    if (!branch && mongoose.Types.ObjectId.isValid(branchId)) {
      branch = await Branch.findById(branchId)
    }
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' })
    }

    const charger = branch.chargers.find(
      (c) => c.chargerId === chargerId || (c._id && c._id.toString() === chargerId)
    )
    if (!charger) {
      return res.status(404).json({ message: 'Charger not found' })
    }

    // Filter out the specified port
    charger.ports = charger.ports.filter(
      (p) => p.portId !== portId && (!p._id || p._id.toString() !== portId)
    )

    // Remove charger if no ports remaining
    if (charger.ports.length === 0) {
      branch.chargers = branch.chargers.filter(
        (c) => c.chargerId !== chargerId && (!c._id || c._id.toString() !== chargerId)
      )
    }

    await branch.save()

    res.json({ message: 'Port removed successfully', branch })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get all support/maintenance cases
// @route   GET /api/admin/cases
// @access  Admin
const getCases = async (req, res) => {
  try {
    const cases = await SupportCase.find({}).sort({ createdAt: -1 })
    res.json(cases)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get single support case by ID
// @route   GET /api/admin/cases/:caseId
// @access  Admin
const getCaseById = async (req, res) => {
  try {
    const supportCase = await SupportCase.findOne({ caseId: req.params.caseId })
    if (!supportCase) {
      return res.status(404).json({ message: 'Case not found' })
    }
    res.json(supportCase)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update support case status or details
// @route   PATCH /api/admin/cases/:caseId
// @access  Admin
const updateCaseStatus = async (req, res) => {
  try {
    const { status, priority, message } = req.body

    const supportCase = await SupportCase.findOne({ caseId: req.params.caseId })
    if (!supportCase) {
      return res.status(404).json({ message: 'Case not found' })
    }

    if (status) supportCase.status = status
    if (priority) supportCase.priority = priority
    if (message) {
      supportCase.messages.push({
        sender: 'Admin',
        text: message,
      })
    }

    await supportCase.save()
    res.json(supportCase)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update status of all ports in a branch (e.g. mark closed/faulty or available)
// @route   PATCH /api/admin/branches/:branchId/status
// @access  Admin
const updateBranchStatus = async (req, res) => {
  try {
    const { branchId } = req.params
    const { status } = req.body

    let branch = await Branch.findOne({ branchId })
    if (!branch && mongoose.Types.ObjectId.isValid(branchId)) {
      branch = await Branch.findById(branchId)
    }
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' })
    }

    if (status) {
      branch.chargers.forEach((charger) => {
        charger.ports.forEach((port) => {
          port.status = status
        })
      })
      if (status === 'faulty') {
        branch.status = 'offline'
      } else if (status === 'available') {
        branch.status = 'online'
      }
    }

    await branch.save()
    res.json({ message: 'Branch status updated', branch })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
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
}

