const Slot = require('../models/Slot');
const User = require('../models/User');
const axios = require('axios');

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private (Verified users only)
const createSlot = async (req, res) => {
  try {
    const {
      departureCity,
      departureCountry,
      destinationCity,
      destinationCountry,
      departureDate,
      availableWeight,
      dimensions,
      pricePerKg,
      isNegotiable,
      eTicket
    } = req.body;

    // Validation
    if (!departureCity || !departureCountry || !destinationCity || 
        !destinationCountry || !departureDate || !availableWeight || 
        !pricePerKg || !eTicket) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify user is a traveler
    const user = await User.findById(req.user.id);
    if (user.userType !== 'traveler' && user.userType !== 'both') {
      return res.status(403).json({
        success: false,
        message: 'Only travelers can create slots'
      });
    }

    // Create slot
    const slot = await Slot.create({
      traveler: req.user.id,
      departureCity,
      departureCountry,
      destinationCity,
      destinationCountry,
      departureDate,
      availableWeight,
      dimensions,
      pricePerKg,
      isNegotiable: isNegotiable !== undefined ? isNegotiable : true,
      eTicket
    });

    // In production, send e-ticket to Python service for OCR
    try {
      // const pythonResponse = await axios.post(
      //   `${process.env.PYTHON_SERVICE_URL}/api/verify-ticket`,
      //   { ticketImage: eTicket }
      // );

      // Mock OCR response
      const extractedData = {
        destination: destinationCity,
        date: departureDate,
        flightNumber: 'PK' + Math.floor(Math.random() * 1000)
      };

      // Verify extracted data matches input
      const isValid = extractedData.destination.toLowerCase().includes(destinationCity.toLowerCase());

      if (isValid) {
        slot.is_ticket_verified = true;
        slot.extractedTicketData = extractedData;
        slot.status = 'active';
        await slot.save();
      }
    } catch (error) {
      console.error('Ticket verification error:', error);
      // Slot remains pending if OCR fails
    }

    const populatedSlot = await Slot.findById(slot._id).populate('traveler', 'fullName email rating completedDeliveries');

    res.status(201).json({
      success: true,
      message: slot.is_ticket_verified 
        ? 'Slot created and verified successfully' 
        : 'Slot created, pending ticket verification',
      data: populatedSlot
    });
  } catch (error) {
    console.error('Create slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all active slots
// @route   GET /api/slots
// @access  Public
const getSlots = async (req, res) => {
  try {
    const { destination, departureDate, maxPrice } = req.query;

    // Build query
    let query = { status: 'active', is_ticket_verified: true };

    if (destination) {
      query.$or = [
        { destinationCity: new RegExp(destination, 'i') },
        { destinationCountry: new RegExp(destination, 'i') }
      ];
    }

    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 7); // 7 day range
      
      query.departureDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (maxPrice) {
      query.pricePerKg = { $lte: parseFloat(maxPrice) };
    }

    const slots = await Slot.find(query)
      .populate('traveler', 'fullName email rating completedDeliveries profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get slot by ID
// @route   GET /api/slots/:id
// @access  Public
const getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id)
      .populate('traveler', 'fullName email rating completedDeliveries profileImage mobileNumber');

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    console.error('Get slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get traveler's slots
// @route   GET /api/slots/my-slots
// @access  Private
const getMySlots = async (req, res) => {
  try {
    const slots = await Slot.find({ traveler: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots
    });
  } catch (error) {
    console.error('Get my slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update slot
// @route   PUT /api/slots/:id
// @access  Private
const updateSlot = async (req, res) => {
  try {
    let slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check ownership
    if (slot.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this slot'
      });
    }

    const { availableWeight, pricePerKg, isNegotiable, status } = req.body;

    if (availableWeight) slot.availableWeight = availableWeight;
    if (pricePerKg) slot.pricePerKg = pricePerKg;
    if (isNegotiable !== undefined) slot.isNegotiable = isNegotiable;
    if (status) slot.status = status;

    await slot.save();

    res.status(200).json({
      success: true,
      message: 'Slot updated successfully',
      data: slot
    });
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Private
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Check ownership
    if (slot.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this slot'
      });
    }

    await slot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully'
    });
  } catch (error) {
    console.error('Delete slot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createSlot,
  getSlots,
  getSlotById,
  getMySlots,
  updateSlot,
  deleteSlot
};
