const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ReservationType = require("../models/ReservationType");

dotenv.config({ quiet: true });

const reservationTypes = [
  {
    slug: "luxury-chefs-course",
    title: "Luxury Chef's Course",
    eyebrow: "Chef's menu from Rs 3,500 per person",
    description: "Booking deposit Rs 1,000 per guest.",
    details: ["Settle the remaining balance", "at the restaurant."],
    badgeLabel: "Pre-booking",
    icon: "cloche",
    pageGroup: "primary",
    cardSize: "standard",
    mealPeriods: ["lunch", "dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 1,
    isActive: true,
  },
  {
    slug: "high-tea-ritual",
    title: "High Tea Ritual",
    eyebrow: "",
    description: "Mon + Wed + Fri",
    details: ["Tue + Thu on alternate days"],
    badgeLabel: "",
    icon: "teapot",
    pageGroup: "primary",
    cardSize: "standard",
    mealPeriods: ["lunch"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 2,
    isActive: true,
  },
  {
    slug: "business-lunch",
    title: "Business Lunch",
    eyebrow: "Refined a la carte lunch experience",
    description: "with modern Indian flavours.",
    details: [],
    badgeLabel: "A la carte",
    icon: "briefcase",
    pageGroup: "primary",
    cardSize: "standard",
    mealPeriods: ["lunch"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 3,
    isActive: true,
  },
  {
    slug: "special-occasion",
    title: "Special Occasion",
    eyebrow: "For celebrations, intimate",
    description: "gatherings, and curated memorable dining.",
    details: [],
    badgeLabel: "",
    icon: "lotus",
    pageGroup: "primary",
    cardSize: "standard",
    mealPeriods: ["lunch", "dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 4,
    isActive: true,
  },
  {
    slug: "sunday-brunch",
    title: "Sunday Brunch",
    eyebrow: "Weekend gathering menu",
    description: "Available Sundays for lunch service only.",
    details: [],
    badgeLabel: "",
    icon: "cloche",
    pageGroup: "more",
    cardSize: "standard",
    mealPeriods: ["lunch"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 5,
    isActive: true,
  },
  {
    slug: "sunset-sessions",
    title: "Sunset Sessions",
    eyebrow: "Evening lounge experience",
    description: "Ideal for early dinner and cocktails.",
    details: [],
    badgeLabel: "",
    icon: "sun",
    pageGroup: "more",
    cardSize: "standard",
    mealPeriods: ["dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 6,
    isActive: true,
  },
  {
    slug: "festive-menus",
    title: "Festive Menus",
    eyebrow: "Seasonal celebration dining",
    description: "Available during selected festive periods.",
    details: [],
    badgeLabel: "Seasonal",
    icon: "lotus",
    pageGroup: "more",
    cardSize: "standard",
    mealPeriods: ["lunch", "dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 7,
    isActive: true,
  },
  {
    slug: "artisan-collaborations",
    title: "Artisan Collaborations",
    eyebrow: "Special chef / maker events",
    description: "Limited-seat curated experiences.",
    details: [],
    badgeLabel: "Limited dates",
    icon: "handshake",
    pageGroup: "more",
    cardSize: "standard",
    mealPeriods: ["lunch", "dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 8,
    isActive: true,
  },
  {
    slug: "farmer-stories",
    title: "Farmer Stories",
    eyebrow: "Produce-led tasting experience",
    description: "Seasonal menus inspired by local ingredients.",
    details: [],
    badgeLabel: "Seasonal",
    icon: "tractor",
    pageGroup: "more",
    cardSize: "wide",
    mealPeriods: ["lunch", "dinner"],
    defaultGuests: 2,
    minGuests: 1,
    maxGuests: 12,
    sortOrder: 9,
    isActive: true,
  },
];

async function seedReservationTypes() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const reservationType of reservationTypes) {
    await ReservationType.findOneAndUpdate(
      { slug: reservationType.slug },
      { $set: reservationType },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`Seeded reservation type ${reservationType.slug}`);
  }

  await mongoose.disconnect();
}

seedReservationTypes().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});