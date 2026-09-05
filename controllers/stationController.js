const Station = require('../models/StationModel');
const { sendResponse, ApiError, asyncHandler, getPagination, parseCsvParam } = require('../utils/helper');

// Maps the "Sort by" options in FindStation.jsx's filter dropdown to a Mongo sort spec
const SORT_MAP = {
  Nearby: { distanceKm: 1 },
  Ratings: { rating: -1 },
  'Charging Speed': { maxChargingSpeedKw: -1 },
  'Charging Port': { portsCount: -1 },
  'Vehicle Model': { name: 1 }, // model filtering is applied separately; this just orders results
};

// @desc    List stations with search, filters, sorting and pagination
// @route   GET /api/stations
// @query   search, status, model, port, sortBy, page, limit
// @access  Public
const getStations = asyncHandler(async (req, res) => {
  const { search, status, model, port, sortBy } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};

  if (status) {
    const statuses = parseCsvParam(status);
    filter.status = statuses ? { $in: statuses } : status;
  }

  if (model) {
    // matches FindStation.jsx's "Vehicle model" chip filter (supportedModels?.includes(selectedModel))
    filter.supportedModels = model;
  }

  if (port) {
    // matches FindStation.jsx's "Charging port" chip filter (stationHasPort)
    filter['connectors.name'] = port;
  }

  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { address: { $regex: term, $options: 'i' } },
    ];
  }

  const sort = SORT_MAP[sortBy] || SORT_MAP.Nearby;

  const [stations, total] = await Promise.all([
    Station.find(filter).sort(sort).skip(skip).limit(limit),
    Station.countDocuments(filter),
  ]);

  return sendResponse(res, 200, stations, {
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
});

// @desc    Get a single station by its slug (matches useParams() id in StationDetails.jsx)
// @route   GET /api/stations/:id
// @access  Public
const getStationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const station = await Station.findOne({ slug: id });

  if (!station) {
    throw new ApiError(404, `Station not found for id '${id}'`);
  }

  return sendResponse(res, 200, station);
});

// @desc    Create a new station
// @route   POST /api/stations
// @access  Private
const createStation = asyncHandler(async (req, res) => {
  const station = await Station.create(req.body);
  return sendResponse(res, 201, station);
});

// @desc    Update an existing station
// @route   PUT /api/stations/:id
// @access  Private
const updateStation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const station = await Station.findOneAndUpdate({ slug: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!station) {
    throw new ApiError(404, `Station not found for id '${id}'`);
  }

  return sendResponse(res, 200, station);
});

// @desc    Delete a station
// @route   DELETE /api/stations/:id
// @access  Private
const deleteStation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const station = await Station.findOneAndDelete({ slug: id });

  if (!station) {
    throw new ApiError(404, `Station not found for id '${id}'`);
  }

  return sendResponse(res, 200, { deleted: true, slug: id });
});

module.exports = {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
};
