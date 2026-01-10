const { getModels } = require('../../models/init-models.js');
const { Reviews, Users, ReviewCriterias } = getModels();

const getAllReviews = async (req, res) => {
  try {
    const { hotelId } = req.body;
    if (!hotelId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing hotelId' });
    }
    const reviews = await Reviews.findAll({
      where: { hotel_id: hotelId },
    });

    for (const review of reviews) {
      const user = await Users.findOne({
        where: { user_id: review.user_id },
      });
      review.user_name = user.username;
      review.user_email = user.email;
      // get reivew criteria
      const criteria = await ReviewCriterias.findAll({
        where: { review_id: review.review_id },
        attributes: ['criteria_name', 'score'],
      });
      review.review_criteria = criteria;
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const postReview = async (req, res) => {
  try {
    const { userId, hotelId, rating, comment } = req.body;
    if (!userId || !hotelId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }
    await Reviews.update({
      user_id: userId,
      hotel_id: hotelId,
      rating: rating,
      comment: comment,
    });
    res
      .status(201)
      .json({ success: true, message: 'Review posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const replyToReview = async (req, res) => {
  try {
    const { reviewId, reply } = req.body;
    if (!reviewId || !reply) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }
    await Reviews.update(
      {
        reply: reply,
      },
      {
        where: {
          review_id: reviewId,
        },
      }
    );
    res
      .status(201)
      .json({ success: true, message: 'Reply posted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllReviews, postReview, replyToReview };
