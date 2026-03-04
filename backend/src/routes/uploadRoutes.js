const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload CNIC images
// @route   POST /api/upload/cnic
// @access  Private
router.post('/cnic', protect, upload.array('cnicImages', 2), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload CNIC images'
      });
    }

    const filePaths = req.files.map(file => file.path);

    res.status(200).json({
      success: true,
      message: 'CNIC images uploaded successfully',
      data: {
        files: filePaths
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

// @desc    Upload e-ticket
// @route   POST /api/upload/ticket
// @access  Private
router.post('/ticket', protect, upload.single('ticket'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a ticket'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket uploaded successfully',
      data: {
        file: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file'
    });
  }
});

// @desc    Upload parcel images
// @route   POST /api/upload/parcel
// @access  Private
router.post('/parcel', protect, upload.array('parcelImages', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload parcel images'
      });
    }

    const filePaths = req.files.map(file => file.path);

    res.status(200).json({
      success: true,
      message: 'Parcel images uploaded successfully',
      data: {
        files: filePaths
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files'
    });
  }
});

module.exports = router;
