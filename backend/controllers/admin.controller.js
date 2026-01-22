import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// ============= BUS MANAGEMENT =============

export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBus = async (req, res) => {
  try {
    const { busName, busNumber, totalSeats, busType, amenities } = req.body;

    // Validate required fields
    if (!busName || !busNumber || !totalSeats) {
      return res.status(400).json({ message: 'Bus name, bus number, and total seats are required' });
    }

    // Check if bus with same number already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ message: 'Bus with this number already exists' });
    }

    const bus = new Bus({
      busName,
      busNumber,
      totalSeats,
      busType: busType || 'AC',
      amenities: amenities || [],
      isActive: true
    });

    await bus.save();
    res.status(201).json({ message: 'Bus created successfully', bus });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { busName, totalSeats, busType, amenities, isActive } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      id,
      { busName, totalSeats, busType, amenities, isActive },
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({ message: 'Bus updated successfully', bus });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findByIdAndDelete(id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============= ROUTE MANAGEMENT =============

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({})
      .populate('bus')
      .sort({ date: 1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createRoute = async (req, res) => {
  try {
    // Support both legacy startLocation/endLocation and model's from/to
    const from = req.body.from || req.body.startLocation;
    const to = req.body.to || req.body.endLocation;
    const { bus, departureTime, arrivalTime, price, date, duration } = req.body;

    if (!bus || !from || !to || !departureTime || !arrivalTime || !price || !date) {
      return res.status(400).json({ message: 'All fields are required (bus, from, to, departureTime, arrivalTime, price, date)' });
    }

    // Check if bus exists
    const busExists = await Bus.findById(bus);
    if (!busExists) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Calculate duration if not provided
    let calculatedDuration = duration;
    if (!calculatedDuration) {
      const [depHour, depMin] = departureTime.split(':').map(Number);
      const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
      
      let durationMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
      if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle next day arrival
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      calculatedDuration = `${hours}h ${minutes}m`;
    }

    const route = new Route({
      bus,
      from,
      to,
      departureTime,
      arrivalTime,
      duration: calculatedDuration,
      price,
      date,
      availableSeats: busExists.totalSeats,
      bookedSeats: []
    });

    await route.save();
    const populatedRoute = await Route.findById(route._id).populate('bus');

    res.status(201).json({ message: 'Route created successfully', route: populatedRoute });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const from = req.body.from || req.body.startLocation;
    const to = req.body.to || req.body.endLocation;
    const { departureTime, arrivalTime, price, date, duration } = req.body;

    // Calculate duration if not provided but times are
    let calculatedDuration = duration;
    if (!calculatedDuration && departureTime && arrivalTime) {
      const [depHour, depMin] = departureTime.split(':').map(Number);
      const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
      
      let durationMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
      if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle next day arrival
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      calculatedDuration = `${hours}h ${minutes}m`;
    }

    const updateData = { from, to, departureTime, arrivalTime, price, date };
    if (calculatedDuration) {
      updateData.duration = calculatedDuration;
    }

    const route = await Route.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('bus');

    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({ message: 'Route updated successfully', route });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByIdAndDelete(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============= BOOKING MANAGEMENT =============

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', '-password')
      .populate({
        path: 'route',
        populate: {
          path: 'bus'
        }
      })
      .populate('bus')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('user', '-password')
      .populate({
        path: 'route',
        populate: {
          path: 'bus'
        }
      })
      .populate('bus');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    
    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status to cancelled
    booking.bookingStatus = 'cancelled';
    const savedBooking = await booking.save();

    // Release seats back to route
    const route = await Route.findById(booking.route);
    if (route) {
      
      route.bookedSeats = route.bookedSeats.filter(seat => !booking.seatNumbers.includes(seat));
      route.availableSeats += booking.seatNumbers.length;
      await route.save();
      
    }

    const updatedBooking = await Booking.findById(id)
      .populate('user', '-password')
      .populate('route')
      .populate('bus');

    res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============= USER MANAGEMENT =============

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's bookings
    await Booking.deleteMany({ user: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============= DASHBOARD STATISTICS =============

export const getDashboardStats = async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ $or: [{ role: 'admin' }, { role: 'super_admin' }] });
    const allUsers = await User.countDocuments();
    const totalUsers = allUsers - totalAdmins; // Total users excluding admins
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const confirmedBookings = await Booking.countDocuments({ 
      status: { $in: ['confirmed', null, undefined] }
    });
    const cancelledBookings = await Booking.countDocuments({ 
      status: 'cancelled'
    });

    // Calculate revenue (confirmed bookings only)
    const revenueData = await Booking.aggregate([
      { 
        $match: { 
          $or: [
            { status: 'confirmed' },
            { status: null },
            { status: { $exists: false } }
          ]
        } 
      },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalAdmins,
      totalBuses,
      totalRoutes,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
