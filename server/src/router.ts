import express from "express";
import databaseClient from "../database/client";
import cartActions from "./modules/cart/cartAction";

const router = express.Router();

router.get("/api/health", async (_req, res) => {
  try {
    await databaseClient.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed", error);
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

import authMiddleware from "./Middlewares/authMiddleware";
import authActions from "./modules/Authentification/AuthentificationAction";

/* ************************************************************************* */
// Auth routes (publiques)
/* ************************************************************************* */
router.post("/api/auth/register", authActions.register);
router.post("/api/auth/login/client", authActions.loginClient);
router.post("/api/auth/login/admin", authActions.loginAdmin);
router.get("/api/auth/me", authMiddleware.requireAuth, authActions.me);

/* ************************************************************************* */
// Time slots (public)
/* ************************************************************************* */
import timeSlotActions from "./modules/timeSlot/timeSlotActions";

router.get("/api/timeslots", timeSlotActions.browse);

/* ************************************************************************* */
// Spaces (public)
/* ************************************************************************* */
// Define space-related routes
import spaceActions from "./modules/space/spaceActions";

router.get("/api/spaces", spaceActions.browse);
router.get("/api/spaces/:id/availability", spaceActions.readAvailability);

/* ************************************************************************* */
// Events (public)
/* ************************************************************************* */
import eventMiddleware from "./Middlewares/eventMiddleware";
import eventActions from "./modules/event/eventActions";

router.get("/api/events", eventActions.browseUpcomingEvents);
router.get("/api/events/participants", eventActions.browseParticipantsToEvent);
router.get(
  "/api/events/:date",
  eventMiddleware.validateEventsDate,
  eventActions.readEventsOfTheDay,
);

// Events (protégé client)

// book an event : process the price with body.quantity
router.post(
  "/api/events/:id",
  authMiddleware.requireAuth,
  eventActions.processTotalPrice,
);

/* ************************************************************************* */
// Dashboard Client (protégé client)
/* ************************************************************************* */
import dashboardClientActions from "./modules/dashboardClient/dashboardClientActions";

// Invoice
router.get(
  "/api/invoice/:bookingId",
  authMiddleware.requireAuth,
  dashboardClientActions.readInvoice,
);

// *************************************************************************
// Event requests (client) - Before :userID road
router.get(
  "/api/dashboard/client/event-requests",
  authMiddleware.requireAuth,
  dashboardClientActions.browseEventRequests,
);

router.post(
  "/api/dashboard/client/event-requests",
  authMiddleware.requireAuth,
  upload.single("image"),
  dashboardClientActions.addEventRequest,
);
// *************************************************************************

// 1.past events the user attended
router.get(
  "/api/dashboard/client/:userId/events/past",
  authMiddleware.requireAuth,
  dashboardClientActions.browsePastEvents,
);

router.get(
  "/api/dashboard/client/:userId/events/upcoming",
  authMiddleware.requireAuth,
  dashboardClientActions.browseUpcomingEvents,
);

router.get(
  "/api/dashboard/client/:userId/bookings/past",
  authMiddleware.requireAuth,
  dashboardClientActions.browseOldBookings,
);

router.get(
  "/api/dashboard/client/:userId/bookings/upcoming",
  authMiddleware.requireAuth,
  dashboardClientActions.browseUpcomingBookings,
);

router.get(
  "/api/dashboard/client/:userId/billing",
  authMiddleware.requireAuth,
  dashboardClientActions.browseBookingHistory,
);

router.get(
  "/api/dashboard/client/:userId/stats",
  authMiddleware.requireAuth,
  dashboardClientActions.browseStats,
);

router.post(
  "/api/dashboard/client/:userId/claims",
  authMiddleware.requireAuth,
  dashboardClientActions.addClaim,
);

/* ************************************************************************* */
// Dashboard Admin (protégé admin)
/* ************************************************************************* */
import dasboardAdminActions from "./modules/dashboardAdmin/dashboardAdminActions";

router.get(
  "/api/dashboard/admin/stats",
  authMiddleware.requireAdmin,
  dasboardAdminActions.browseAdminStats,
);
router.get(
  "/api/dashboard/admin/occupancy-trend",
  authMiddleware.requireAdmin,
  dasboardAdminActions.browseAdminOccupancyTrend,
);

router.get(
  "/api/dashboard/admin/bookings",
  authMiddleware.requireAdmin,
  dasboardAdminActions.browseAdminBookings,
);

router.get(
  "/api/dashboard/admin/claims",
  authMiddleware.requireAdmin,
  dasboardAdminActions.browseClaims,
);

router.get(
  "/api/dashboard/admin/event-requests",
  authMiddleware.requireAdmin,
  dasboardAdminActions.browseAdminEventRequests,
);
// patch = partial update
router.patch(
  "/api/dashboard/admin/event-requests/:activityId",
  authMiddleware.requireAdmin,
  dasboardAdminActions.updateEventRequest,
);

/* ************************************************************************* */
// Panier (protégé client)
/* ************************************************************************* */
import cartMiddleware from "./Middlewares/cartMiddleware";

router.get("/api/cart/:userId", authMiddleware.requireAuth, cartActions.browse);

// add an event into cart
router.post(
  "/api/cart",
  authMiddleware.requireAuth,
  cartMiddleware.validateAddEventCart,
  cartActions.addEvent,
);

//update a cart item
router.patch(
  "/api/cart/:id",
  authMiddleware.requireAuth,
  cartMiddleware.validateUpdateCart,
  cartActions.edit,
);

// delete an item into cart
router.delete(
  "/api/cart/:id",
  authMiddleware.requireAuth,
  cartMiddleware.validateDeleteItem,
  cartActions.destroy,
);

// clear the cart of a user
router.delete(
  "/api/cart/user/:userId",
  authMiddleware.requireAuth,
  cartActions.destroyAll,
);

/* ************************************************************************* */
// Create Event (protégé admin)
/* ************************************************************************* */
import { upload } from "../public/upload/upload";
import createEventFormAction from "./modules/createEventForm/createEventFormAction";

router.get(
  "/api/createEvent",
  authMiddleware.requireAdmin,
  createEventFormAction.browse,
);
router.post(
  "/api/createEvent",
  authMiddleware.requireAdmin,
  upload.single("image"),
  createEventFormAction.create,
);

/* ************************************************************************* */
// Payment (protégé client)
/* ************************************************************************* */
import paymentActions from "./modules/Payment/PaymentAction";

router.post(
  "/api/payment/create-intent",
  authMiddleware.requireAuth,
  paymentActions.createIntent,
);

/* ************************************************************************* */
// Define booking-related routes

import bookingActions from "./modules/bookingActions/bookingActions";

// insert activity booked into cart table and activity table
router.post("/api/bookings", authMiddleware.requireAuth, bookingActions.add);

// insert cart content into boooking table
router.post("/api/booking", authMiddleware.requireAuth, bookingActions.create);

/* ************************************************************************* */
// Workshop
/* ************************************************************************* */

import activityActions from "./modules/activity/activityActions";

router.get("/api/activity", activityActions.browse);

export default router;
