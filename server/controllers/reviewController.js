const { getModels } = require('../models/init-models.js');
const { Reviews, ReviewCriterias, Hotels, Bookings } = getModels();

const validateReview = async (req, res) => {
  try {
    const buyerId = req.session.user.user_id;
    const { bookingCode, hotelId } = req.body;
    if (!bookingCode || !hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing bookingCode' });
    }

    const booking = await Bookings.findOne({
      where: {
        booking_code: bookingCode,
        buyer_id: buyerId,
        hotel_id: hotelId,
        status: 'completed',
      },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, bookingCode: bookingCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkAlreadyReviewed = async (req, res) => {
  try {
    const { bookingCode, hotelId } = req.body;
    if (!bookingCode || !hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing bookingCode' });
    }

    const review = await Reviews.findOne({
      where: { booking_code: bookingCode, hotel_id: hotelId },
      include: [
        {
          model: ReviewCriterias,
          attributes: ['criteria_name', 'score'],
        },
      ],
    });

    if (review) {
      return res.status(200).json({
        success: true,
        review: {
          review_id: review.review_id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          reply: review.reply,
          number_of_likes: review.number_of_likes,
          number_of_dislikes: review.number_of_dislikes,
          review_criteria: review.ReviewCriterias,
        },
      });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const postReview = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const { hotelId, overallRating, comment, reviewCriteria, bookingCode } =
      req.body;

    if (
      !userId ||
      !hotelId ||
      !overallRating ||
      !comment ||
      !reviewCriteria ||
      !bookingCode
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const review = await Reviews.create({
      user_id: userId,
      hotel_id: hotelId,
      rating: overallRating,
      comment: comment,
      booking_code: bookingCode,
    });

    const criteriaPromises = reviewCriteria
      .filter((criteria) => criteria.value)
      .map((criteria) =>
        ReviewCriterias.create({
          review_id: review.review_id,
          criteria_name: criteria.name,
          score: criteria.value,
        })
      );

    await Promise.all(criteriaPromises);

    res
      .status(201)
      .json({ success: true, message: 'Review posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const userId = req.session.user.user_id;

    const bookings = await Bookings.findAll({
      where: {
        buyer_id: userId,
        status: 'completed',
      },
      attributes: ['hotel_id', 'booking_code'],
      include: [
        {
          model: Hotels,
          attributes: ['hotel_id', 'name', 'image_urls'],
        },
        {
          model: Reviews,
          attributes: [
            'review_id',
            'rating',
            'comment',
            'created_at',
            'reply',
            'number_of_likes',
            'number_of_dislikes',
          ],
        },
      ],
      group: ['hotel_id', 'booking_code'],
    });

    res.status(200).json({ reviews: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  validateReview,
  postReview,
  getAllReviews,
  checkAlreadyReviewed,
};
