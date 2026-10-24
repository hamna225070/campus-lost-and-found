const mongoose = require('mongoose');
const { Item, CATEGORIES } = require('../models/Item');

// @desc    Get all items with search, filters, pagination, and sorting
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      status,
      sort = 'newest',
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Filter by type (lost / found)
    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by status (open / resolved)
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // Search by title, description, or location
    if (search && search.trim() !== '') {
      const sanitized = search.trim();
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    const items = await Item.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email role');

    res.status(200).json({
      success: true,
      count: items.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found. Invalid ID format.',
      });
    }

    const item = await Item.findById(id).populate('user', 'name email role');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lost or found report
// @route   POST /api/items
// @access  Private (Authenticated students/admins)
const createItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      dateOfIncident,
      imageUrl,
      contactInfo,
    } = req.body;

    // Field presence validation
    if (!title || !description || !category || !type || !location || !dateOfIncident || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, type, location, date, and contact info.',
      });
    }

    // Validate category
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${CATEGORIES.join(', ')}`,
      });
    }

    // Validate type
    if (!['lost', 'found'].includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"',
      });
    }

    // Sanitize image URL if provided
    let cleanImageUrl = '';
    if (imageUrl && typeof imageUrl === 'string') {
      cleanImageUrl = imageUrl.trim();
      // Simple basic safety check on image url
      if (cleanImageUrl.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Image URL is too long (maximum 500 characters)',
        });
      }
    }

    const item = await Item.create({
      title: title.trim(),
      description: description.trim(),
      category,
      type: type.toLowerCase(),
      location: location.trim(),
      dateOfIncident: new Date(dateOfIncident),
      imageUrl: cleanImageUrl,
      contactInfo: contactInfo.trim(),
      status: 'open',
      user: req.user._id,
    });

    const populatedItem = await item.populate('user', 'name email role');

    res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing item report
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found. Invalid ID format.',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    // Ownership check: must be the creator OR an administrator
    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only edit reports that you created.',
      });
    }

    const {
      title,
      description,
      category,
      type,
      location,
      dateOfIncident,
      imageUrl,
      contactInfo,
      status,
    } = req.body;

    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${CATEGORIES.join(', ')}`,
      });
    }

    if (type && !['lost', 'found'].includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"',
      });
    }

    if (status && !['open', 'resolved'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "open" or "resolved"',
      });
    }

    if (title !== undefined) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (category !== undefined) item.category = category;
    if (type !== undefined) item.type = type.toLowerCase();
    if (location !== undefined) item.location = location.trim();
    if (dateOfIncident !== undefined) item.dateOfIncident = new Date(dateOfIncident);
    if (imageUrl !== undefined) item.imageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';
    if (contactInfo !== undefined) item.contactInfo = contactInfo.trim();
    if (status !== undefined) item.status = status.toLowerCase();

    const updatedItem = await item.save();
    const populated = await updatedItem.populate('user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Item report updated successfully',
      item: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item status (e.g. mark as resolved / open)
// @route   PATCH /api/items/:id/status
// @access  Private (Owner or Admin)
const updateItemStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found. Invalid ID format.',
      });
    }

    if (!status || !['open', 'resolved'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Valid status ("open" or "resolved") is required',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update the status of your own reports.',
      });
    }

    item.status = status.toLowerCase();
    await item.save();
    const populated = await item.populate('user', 'name email role');

    res.status(200).json({
      success: true,
      message: `Report marked as ${item.status}`,
      item: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an item report
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Item not found. Invalid ID format.',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item report not found',
      });
    }

    const isOwner = item.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete reports that you created.',
      });
    }

    await Item.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Item report deleted successfully',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
};
