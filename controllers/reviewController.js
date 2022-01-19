const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  // checks if product id sent from frontend is valid
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  // checks if the user has already submitted review for the product
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }
  // attaching user to req.body
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  // populate() method replaces the specified fields with selected field from other collections
  const reviews = await Review.find({}).populate({
    path: "product",
    select: ["name", "company", "price"],
  });
  res.status(StatusCodes.OK).json({ reviews, nbHits: reviews.length });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id }).populate({
    path: "product",
    select: ["name", "company", "price"],
  });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${req.params.id}`);
  }

  // throws error if request user is not the resouce user
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  // triggers the pre 'save' hook
  await review.save();
  review.res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id : ${req.params.id}`);
  }
  checkPermissions(req.user, review.user);

  // triggers the pre 'remove' hook
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Review was removed" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, nbHits: (await reviews).length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
