const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const asyncHandler = require('../utilities/asyncHandler');
const User = require('../models/userModel');
const { createOne, getOne, getAll, updateOne, deleteOne } = require('./resourceController');

const endpointSecret = process.env.END_POINT_SECRET;

function getSuccessURL(req, tour) {
  return `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`;
}

function getCancelURL(req, tour) {
  return `${req.protocol}://${req.get('host')}/tour/${tour.slug}`;
}

exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  // Find the tour associated with the checkout session
  const tour = await Tour.findById(req.params.tourId);

  // Generate success and cancel URLs
  const successURL = getSuccessURL(req, tour);
  const cancelURL = getCancelURL(req, tour);

  // Create a new checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: successURL,
    cancel_url: cancelURL,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    payment_intent_data: {
      capture_method: 'manual',
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${process.env.STRIPE_IMAGES_BASE_URL}/img/tours/${tour.imageCover}`,
            ],
          },
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].unit_amount / 100;

  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    exports.createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

const bookingStr = 'booking'

exports.getAllBookings = getAll(Booking);
exports.createBooking = createOne(Booking);
exports.getBooking = getOne(Booking, bookingStr);
exports.updateBooking = updateOne(Booking, bookingStr);
exports.deleteBooking = deleteOne(Booking, bookingStr);


