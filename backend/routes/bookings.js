import express from 'express';
import PDFDocument from 'pdfkit';
import Booking from '../models/Booking.js';
import Route from '../models/Route.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Generate PNR
const generatePNR = () => {
  return 'PNR' + Date.now() + Math.floor(Math.random() * 1000);
};

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { routeId, passengerName, passengerAge, passengerGender, seatNumbers, passengers } = req.body;

    // Check if route exists
    const route = await Route.findById(routeId).populate('bus');
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Validate seats array
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: 'Please provide seatNumbers' });
    }

    // Check if seats are available
    const unavailableSeats = seatNumbers.filter(seat => route.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked', 
        unavailableSeats 
      });
    }

    // Check if enough seats available
    if (route.availableSeats < seatNumbers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate total amount (uniform pricing)
    const totalAmount = route.price * seatNumbers.length;

    const bookingPayload = {
      user: req.userId,
      route: routeId,
      bus: route.bus._id,
      seatNumbers,
      totalAmount,
      journeyDate: route.date,
      pnr: generatePNR()
    };

    // If passengers array provided, store it; else keep legacy single-passenger fields
    if (Array.isArray(passengers) && passengers.length === seatNumbers.length) {
      bookingPayload.passengers = passengers.map((p, idx) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seatNumber: seatNumbers[idx]
      }));
      // Populate legacy fields with first passenger for compatibility
      bookingPayload.passengerName = passengers[0].name;
      bookingPayload.passengerAge = passengers[0].age;
      bookingPayload.passengerGender = passengers[0].gender;
    } else {
      bookingPayload.passengerName = passengerName;
      bookingPayload.passengerAge = passengerAge;
      bookingPayload.passengerGender = passengerGender;
    }

    // Create booking
    const booking = new Booking(bookingPayload);
    await booking.save();

    // Update route
    route.bookedSeats.push(...seatNumbers);
    route.availableSeats -= seatNumbers.length;
    await route.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('route')
      .populate('bus')
      .populate('user', '-password');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('route')
      .populate('bus')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking by PNR
router.get('/pnr/:pnr', async (req, res) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr })
      .populate('route')
      .populate('bus')
      .populate('user', '-password');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    // Update route availability
    const route = await Route.findById(booking.route);
    if (route) {
      route.bookedSeats = route.bookedSeats.filter(
        seat => !booking.seatNumbers.includes(seat)
      );
      route.availableSeats += booking.seatNumbers.length;
      await route.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download ticket PDF
router.get('/:id/ticket', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('route')
      .populate('bus')
      .populate('user', '-password');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization - handle both ObjectId and populated user object
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (bookingUserId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const route = booking.route || {};
    const bus = booking.bus || {};
    const journeyDate = booking.journeyDate ? new Date(booking.journeyDate) : null;
    const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : null;

    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket-${booking.pnr}.pdf"`);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.on('error', (err) => {
      if (!res.headersSent) {
        return res.status(500).json({ message: 'Failed to generate PDF' });
      }
      res.end();
    });

    doc.pipe(res);

    const formatDate = (d) => d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    // Draw ticket border
    doc.roundedRect(30, 30, 535, 720, 10).stroke();
    
    // Header background
    doc.fillColor('#667eea').rect(40, 40, 515, 80).fill();
    
    // Title
    doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('BusIt Ticket', 50, 60, { align: 'center' });
    
    // PNR Section
    doc.fillColor('#f5f7fa').rect(40, 130, 515, 100).fill();
    doc.fillColor('#7f8c8d').fontSize(12).font('Helvetica').text('PNR', 0, 145, { align: 'center' });
    doc.fillColor('#667eea').fontSize(22).font('Helvetica-Bold').text(booking.pnr, 0, 170, { align: 'center' });
    
    // Route Section
    doc.fillColor('#2c3e50').fontSize(14).font('Helvetica');
    const yStart = 260;
    
    // From and To
    doc.fillColor('#7f8c8d').fontSize(10).text('FROM', 60, yStart);
    doc.fillColor('#2c3e50').fontSize(16).font('Helvetica-Bold').text(route.from || '—', 60, yStart + 20);
    
    doc.fillColor('#7f8c8d').fontSize(10).text('TO', 350, yStart);
    doc.fillColor('#2c3e50').fontSize(16).font('Helvetica-Bold').text(route.to || '—', 350, yStart + 20);
    
    // Journey details in grid
    const detailsY = 330;
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('JOURNEY DATE', 60, detailsY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(formatDate(journeyDate), 60, detailsY + 20);
    
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('DEPARTURE', 240, detailsY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(route.departureTime || '—', 240, detailsY + 20);
    
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('ARRIVAL', 380, detailsY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(route.arrivalTime || '—', 380, detailsY + 20);
    
    // Seats and Amount
    const paymentY = 400;
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('SEATS', 60, paymentY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(booking.seatNumbers?.join(', ') || '—', 60, paymentY + 20);
    
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('TOTAL AMOUNT', 350, paymentY);
    doc.fillColor('#667eea').fontSize(14).font('Helvetica-Bold').text(`Rs.${booking.totalAmount}`, 350, paymentY + 20);
    
    // Bus and Booking details
    const busY = 470;
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('BUS', 60, busY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(bus.busName || '—', 60, busY + 20);
    
    doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text('BOOKED ON', 350, busY);
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text(formatDate(bookingDate), 350, busY + 20);
    
    // Passengers Section
    const passengersY = 540;
    doc.fillColor('#2c3e50').fontSize(12).font('Helvetica-Bold').text('PASSENGERS', 60, passengersY);
    
    let currentPassengerY = passengersY + 25;
    if (booking.passengers && booking.passengers.length > 0) {
      booking.passengers.forEach((passenger, index) => {
        doc.fillColor('#7f8c8d').fontSize(10).font('Helvetica').text(`Seat ${passenger.seatNumber}:`, 60, currentPassengerY);
        doc.fillColor('#2c3e50').fontSize(10).font('Helvetica').text(`${passenger.name}, ${passenger.age}yrs, ${passenger.gender}`, 120, currentPassengerY);
        currentPassengerY += 18;
      });
    }
    
    // Footer note
    doc.fillColor('#95a5a6').fontSize(9).font('Helvetica').text('Please carry a valid ID proof during the journey.', 40, 710, { align: 'center', width: 515 });
    
    // Add dashed line separator
    doc.strokeColor('#e0e0e0').dash(5, { space: 5 }).moveTo(60, 700).lineTo(525, 700).stroke();
    doc.undash();

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
