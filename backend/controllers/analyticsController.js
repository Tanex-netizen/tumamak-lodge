import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import VehicleRental from '../models/VehicleRental.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfCurrentYear = startOfYear(now);
    const endOfCurrentYear = endOfYear(now);

    // Total revenue
    const totalRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
          createdAt: {
            $gte: startOfCurrentMonth,
            $lte: endOfCurrentMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Yearly revenue
    const yearlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
          createdAt: {
            $gte: startOfCurrentYear,
            $lte: endOfCurrentYear,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Active bookings (checked-in)
    const activeBookings = await Booking.countDocuments({ status: 'checked-in' });

    // Total rooms
    const totalRooms = await Room.countDocuments();

    // Available rooms
    const availableRooms = await Room.countDocuments({ isAvailable: true });

    // Total users
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Total reviews
    const totalReviews = await Review.countDocuments();

    // Revenue by month (current year)
    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
          createdAt: {
            $gte: startOfCurrentYear,
            $lte: endOfCurrentYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Top rated rooms
    const topRatedRooms = await Room.find()
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(5)
      .select('name roomNumber averageRating totalReviews images');

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('room', 'name roomNumber')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      revenue: {
        total: totalRevenue[0]?.total || 0,
        monthly: monthlyRevenue[0]?.total || 0,
        yearly: yearlyRevenue[0]?.total || 0,
        byMonth: revenueByMonth,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        active: activeBookings,
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
      },
      users: {
        total: totalUsers,
      },
      reviews: {
        total: totalReviews,
      },
      topRatedRooms,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {
      status: { $nin: ['cancelled'] },
      paymentStatus: 'fully-paid',
    };

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Total revenue
    const totalRevenue = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          roomRevenue: { $sum: '$roomPrice' },
          reservationFees: { $sum: '$reservationFee' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by room
    const revenueByRoom = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$room',
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomDetails',
        },
      },
      {
        $unwind: '$roomDetails',
      },
      {
        $project: {
          roomName: '$roomDetails.name',
          roomNumber: '$roomDetails.roomNumber',
          revenue: 1,
          bookings: 1,
        },
      },
      {
        $sort: { revenue: -1 },
      },
    ]);

    // Payment status breakdown
    const paymentStatusBreakdown = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          ...(startDate && endDate
            ? {
                createdAt: {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate),
                },
              }
            : {}),
        },
      },
      {
        $group: {
          _id: '$paymentStatus',
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      summary: totalRevenue[0] || {
        total: 0,
        roomRevenue: 0,
        reservationFees: 0,
        count: 0,
      },
      revenueByRoom,
      paymentStatusBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/analytics/bookings
// @access  Private/Admin
export const getBookingStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchQuery = {};

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Bookings by month
    const bookingsByMonth = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Average booking value
    const avgBookingValue = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          ...matchQuery,
        },
      },
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalAmount' },
          avgNights: { $avg: '$numberOfNights' },
        },
      },
    ]);

    res.json({
      bookingsByStatus,
      bookingsByMonth,
      averages: avgBookingValue[0] || { avgValue: 0, avgNights: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (simplified for admin dashboard)
// @route   GET /api/analytics/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Total revenue (only fully-paid bookings)
    const totalRevenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Last month revenue for growth calculation
    const lastMonthRevenueResult = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
          createdAt: { $lt: lastMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Total bookings
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['confirmed', 'checked-in'] } 
    });

    // Total users
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const newUsersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
    });

    // Occupancy rate - calculate average over last 30 days
    const totalRooms = await Room.countDocuments();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get all bookings in the last 30 days
    const bookingsLast30Days = await Booking.find({
      status: { $in: ['confirmed', 'checked-in', 'checked-out'] },
      $or: [
        { checkInDate: { $gte: thirtyDaysAgo, $lte: now } },
        { checkOutDate: { $gte: thirtyDaysAgo, $lte: now } },
        { 
          checkInDate: { $lte: thirtyDaysAgo },
          checkOutDate: { $gte: now }
        }
      ]
    }).select('checkInDate checkOutDate');

    // Calculate total room-nights booked
    let totalRoomNightsBooked = 0;
    bookingsLast30Days.forEach(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      
      // Clamp dates to the 30-day window
      const effectiveCheckIn = checkIn < thirtyDaysAgo ? thirtyDaysAgo : checkIn;
      const effectiveCheckOut = checkOut > now ? now : checkOut;
      
      // Calculate nights within the window
      const nights = Math.ceil((effectiveCheckOut - effectiveCheckIn) / (1000 * 60 * 60 * 24));
      totalRoomNightsBooked += Math.max(0, nights);
    });

    // Total available room-nights = total rooms * 30 days
    const totalAvailableRoomNights = totalRooms * 30;
    const occupancyRate = totalAvailableRoomNights > 0 
      ? (totalRoomNightsBooked / totalAvailableRoomNights) * 100 
      : 0;

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

        // Revenue breakdown: Reservation Fees vs Room Total
    const revenueBreakdown = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
        },
      },
      {
        $group: {
          _id: null,
          totalReservationFees: { $sum: '$reservationFee' },
          totalRoomPrice: { $sum: '$roomPrice' },
          totalRoomRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Vehicle rental revenue
    const vehicleRentalRevenue = await VehicleRental.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
        },
      },
      {
        $group: {
          _id: null,
          totalRentalRevenue: { $sum: { $add: ['$rentalCost', '$reservationFee'] } },
          totalRentalReservationFees: { $sum: '$reservationFee' },
        },
      },
    ]);

    const reservationFeesTotal = revenueBreakdown[0]?.totalReservationFees || 0;
    const roomPriceTotal = revenueBreakdown[0]?.totalRoomPrice || 0;
    const roomRevenueTotal = revenueBreakdown[0]?.totalRoomRevenue || 0;
    const rentalReservationFeesTotal = vehicleRentalRevenue[0]?.totalRentalReservationFees || 0;
    const rentalRevenueTotal = vehicleRentalRevenue[0]?.totalRentalRevenue || 0;

    // Revenue by room (only fully-paid bookings)
    const revenueByRoom = await Booking.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled'] },
          paymentStatus: 'fully-paid',
        },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomData',
        },
      },
      {
        $unwind: '$roomData',
      },
      {
        $group: {
          _id: '$room',
          roomName: { $first: '$roomData.name' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          roomName: 1,
          revenue: 1,
          _id: 0,
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      totalRevenue,
      revenueGrowth,
      totalBookings,
      activeBookings,
      totalUsers,
      newUsersThisMonth,
      occupancyRate,
      bookingsByStatus,
      revenueByRoom,
      revenueBreakdown: {
        // Combined reservation fees from both rooms and rentals
        reservationFees: reservationFeesTotal + rentalReservationFeesTotal,
        roomRevenue: roomPriceTotal, // Base room price without reservation fee
        rentalRevenue: rentalRevenueTotal, // Total amount guests paid for rentals
        total: roomRevenueTotal + rentalRevenueTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
