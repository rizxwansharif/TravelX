const User = require('../models/User');
const axios = require('axios');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, mobileNumber, profileImage } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profileImage: user.profileImage,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload CNIC for verification
// @route   POST /api/users/verify/cnic
// @access  Private
const uploadCNIC = async (req, res) => {
  try {
    // In production, files would be uploaded via multer
    // For now, we'll simulate the process
    const { cnicImage } = req.body;

    if (!cnicImage) {
      return res.status(400).json({
        success: false,
        message: 'CNIC image is required'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In production, send to Python service for OCR processing
    // For now, mock the response
    try {
      // const pythonResponse = await axios.post(
      //   `${process.env.PYTHON_SERVICE_URL}/api/verify-cnic`,
      //   { image: cnicImage }
      // );

      // Mock Python service response
      const mockCnicData = {
        idNumber: '12345-1234567-1',
        extractedName: user.fullName,
        facialEmbedding: Array(128).fill(0).map(() => Math.random())
      };

      user.cnicData = mockCnicData;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'CNIC uploaded successfully. Please proceed with live verification.',
        data: {
          idNumber: mockCnicData.idNumber,
          extractedName: mockCnicData.extractedName
        }
      });
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      res.status(500).json({
        success: false,
        message: 'Error processing CNIC image'
      });
    }
  } catch (error) {
    console.error('Upload CNIC error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Live face verification
// @route   POST /api/users/verify/live
// @access  Private
const liveVerification = async (req, res) => {
  try {
    const { liveImage } = req.body;

    if (!liveImage) {
      return res.status(400).json({
        success: false,
        message: 'Live image is required'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.cnicData || !user.cnicData.facialEmbedding) {
      return res.status(400).json({
        success: false,
        message: 'Please upload CNIC first'
      });
    }

    // In production, send to Python service for face matching
    try {
      // const pythonResponse = await axios.post(
      //   `${process.env.PYTHON_SERVICE_URL}/api/verify-face`,
      //   {
      //     liveImage,
      //     storedEmbedding: user.cnicData.facialEmbedding
      //   }
      // );

      // Mock verification (in production, check euclidean distance < 0.6)
      const isMatch = true; // pythonResponse.data.isMatch
      const distance = 0.45; // pythonResponse.data.distance

      if (isMatch) {
        user.is_verified = true;
        await user.save();

        res.status(200).json({
          success: true,
          message: 'Verification successful! You can now use all features.',
          data: {
            is_verified: true,
            matchScore: (1 - distance).toFixed(2)
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Face verification failed. Please try again.'
        });
      }
    } catch (pythonError) {
      console.error('Python service error:', pythonError);
      res.status(500).json({
        success: false,
        message: 'Error processing face verification'
      });
    }
  } catch (error) {
    console.error('Live verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -cnicData');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  updateProfile,
  uploadCNIC,
  liveVerification,
  getUserById
};
