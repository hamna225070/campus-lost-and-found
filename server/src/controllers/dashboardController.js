const User = require('../models/User');
const { Item } = require('../models/Item');

// @desc    Get student dashboard statistics and own reports
// @route   GET /api/dashboard/student
// @access  Private (Authenticated student or admin)
const getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Calculate actual database counts for the student
    const [totalReports, lostCount, foundCount, resolvedCount, items] = await Promise.all([
      Item.countDocuments({ user: userId }),
      Item.countDocuments({ user: userId, type: 'lost' }),
      Item.countDocuments({ user: userId, type: 'found' }),
      Item.countDocuments({ user: userId, status: 'resolved' }),
      Item.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('user', 'name email role'),
    ]);

    const openCount = totalReports - resolvedCount;

    res.status(200).json({
      success: true,
      stats: {
        totalReports,
        lostCount,
        foundCount,
        resolvedCount,
        openCount,
      },
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard statistics and all reports
// @route   GET /api/dashboard/admin
// @access  Private (Administrator only)
const getAdminDashboard = async (req, res, next) => {
  try {
    // Calculate global statistics from database records
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalItems,
      lostCount,
      foundCount,
      resolvedCount,
      items,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'admin' }),
      Item.countDocuments(),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email role'),
    ]);

    const openCount = totalItems - resolvedCount;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalItems,
        lostCount,
        foundCount,
        resolvedCount,
        openCount,
      },
      items,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard,
};
