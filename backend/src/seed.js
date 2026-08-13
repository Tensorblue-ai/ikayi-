const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Experience = require("./models/Experience");
const KitchenExperience = require("./models/KitchenExperience");
const Story = require("./models/Story");
const SignatureExperience = require("./models/SignatureExperience");
const GuestJourney = require("./models/GuestJourney");
const Gallery = require("./models/Gallery");
const Reservation = require("./models/Reservation");

dotenv.config({ quiet: true });

const sections = [
  {
    model: Experience,
    key: "experience",
    data: {
      sectionKey: "experience",
      kicker: "Our Philosophy",
      headingLines: [
        "Hospitality before service.",
        "Connection before transaction.",
        "Experience before consumption.",
      ],
      lede: "Every meal begins with a welcome.",
      body:
        "IKAYI is built on oneness: guests, team, community, artisans, farmers, Lucknow, and India held as one thread. Every detail should feel warm, harmonious, and refined.",
      heroImage: "/assets/exp1.png",
      heroImageAlt: "An intimate Ikayi dining table set inside an arched room",
      ctaLabel: "Explore Our Journey",
      ctaHref: "#stories",
      carryHomeTitle: "The Feeling Guests Carry Home",
      carryHomeCards: [
        {
          image: "/assets/exp2.png",
          title: "Welcomed",
          meta: "Expected / Recognised / Genuinely cared for",
          alt: "Welcomed",
          sortOrder: 1,
        },
        {
          image: "/assets/exp3.png",
          title: "Celebrated",
          meta: "Personal / Thoughtful / Occasion-led",
          alt: "Celebrated",
          sortOrder: 2,
        },
        {
          image: "/assets/exp4.png",
          title: "Calm",
          meta: "Unhurried / Easy / Without performance",
          alt: "Calm",
          sortOrder: 3,
        },
        {
          image: "/assets/exp5.png",
          title: "Connected",
          meta: "Guests / Team / Community / Craft",
          alt: "Connected",
          sortOrder: 4,
        },
      ],
      isPublished: true,
    },
  },
  {
    model: KitchenExperience,
    key: "kitchen-experience",
    data: {
      sectionKey: "kitchen-experience",
      kicker: "Dining Concept",
      heading: "Open Kitchen",
      headingAccent: "Experience",
      body:
        "The open kitchen is an invitation for interaction and connection. Chefs engage with guests where appropriate, finishing touches may happen tableside, and each moment is guided so it feels intentional, not random.",
      ctaLabel: "Plan Your Visit",
      ctaHref: "#reservations",
      images: [
        {
          src: "/assets/kitch1.png",
          alt: "Ikayi chef cooking over an open flame in the kitchen",
          layoutSlot: "large",
          sortOrder: 1,
        },
        {
          src: "/assets/kitch2.png",
          alt: "Chef plating dishes in the Ikayi kitchen",
          layoutSlot: "top",
          sortOrder: 2,
        },
        {
          src: "/assets/kitch3.png",
          alt: "Guests watching the Ikayi open kitchen counter",
          layoutSlot: "middle",
          sortOrder: 3,
        },
        {
          src: "/assets/kitch4.png",
          alt: "Final garnish being placed on a plated dish",
          layoutSlot: "bottom",
          sortOrder: 4,
        },
      ],
      isPublished: true,
    },
  },
  {
    model: Story,
    key: "stories",
    data: {
      sectionKey: "stories",
      heading: "Stories",
      intro: "Hospitality is one of the most powerful ways to bring people together.",
      introAccent: "IKAYI belongs to Lucknow, and to those who come to discover it.",
      cards: [
        {
          image: "/assets/story1.png",
          title: "Rooted",
          copy: "Close to the land, food, and stories of Lucknow and India.",
          href: "#experience",
          icon: "\u2698",
          sortOrder: 1,
        },
        {
          image: "/assets/story2.png",
          title: "Warm",
          copy: "Every guest welcomed as you would welcome someone home.",
          href: "#kitchen-experience",
          icon: "\u25CE",
          sortOrder: 2,
        },
        {
          image: "/assets/story3.png",
          title: "Refined",
          copy: "Excellence over excess; every detail considered.",
          href: "#signature-experiences",
          icon: "\u2726",
          sortOrder: 3,
        },
        {
          image: "/assets/story4.png",
          title: "Curious",
          copy: "Always asking how things can be more honest and thoughtful.",
          href: "#private-dining",
          icon: "\u2302",
          sortOrder: 4,
        },
        {
          image: "/assets/exp3.png",
          title: "Indian",
          copy: "Proudly Indian, honouring tradition without caricature.",
          href: "#gallery",
          icon: "\u2605",
          sortOrder: 5,
        },
      ],
      bannerQuote: "Slow down and indulge.\nLife is meant to be lived, felt, and shared.",
      bannerImage: "/assets/footer.png",
      bannerCtaLabel: "See the Space",
      bannerCtaHref: "#gallery",
      isPublished: true,
    },
  },
  {
    model: SignatureExperience,
    key: "signature-experiences",
    data: {
      sectionKey: "signature-experiences",
      heading: "Signature Experiences",
      intro: "Signature moments shaped by warmth, rhythm, and recognition.",
      introAccent:
        "These experiences are designed to make afternoons unhurried, sunsets memorable, and gatherings feel abundant without overwhelming conversation.",
      cards: [
        {
          image: "/assets/chef5.png",
          title: "Ikayi High Tea",
          copy: "A relaxed, elegant afternoon pause with sweet and savoury offerings.",
          icon: "cloche",
          sortOrder: 1,
        },
        {
          image: "/assets/chef6.png",
          title: "Veranda Ritual",
          copy: "Sunset cocktails, small bites, and a curated shift into evening.",
          icon: "cup",
          sortOrder: 2,
        },
        {
          image: "/assets/chef7.png",
          title: "Ikayi Brunch",
          copy: "Sharing-style dishes served to the table with convivial abundance.",
          icon: "table",
          sortOrder: 3,
        },
        {
          image: "/assets/chef8.png",
          title: "Welcome Ritual",
          copy: "A signature IKAYI gesture being developed ahead of opening.",
          icon: "glass",
          sortOrder: 4,
        },
      ],
      footerTitle: "Traffic Tools, Not Brand Positioning",
      footerCopy:
        "Happy Hour and selective 20% vouchers can support quieter periods, but they should never compete with IKAYI's premium, artisan-led identity.",
      footerCtaLabel: "Explore Our Spaces",
      footerCtaHref: "#gallery",
      isPublished: true,
    },
  },
  {
    model: GuestJourney,
    key: "guest-journey",
    data: {
      sectionKey: "guest-journey",
      kicker: "Guest Journey",
      heading: "From Reservation To Departure",
      bodyParagraphs: [
        "The guest journey begins when a reservation is made, not when someone reaches the door. Names and preferences should be captured so recognition feels natural.",
        "Guests should feel as though they have arrived at someone's home: greeted warmly, seated with care, welcomed immediately, and thanked personally before they leave.",
      ],
      image: "/assets/chef9%20(2).png",
      imageAlt: "Private dining table set inside Ikayi's arched dining room",
      highlights: [
        {
          title: "Arrival",
          copy: "Reservation details, names, and preferences remembered",
          icon: "*",
          sortOrder: 1,
        },
        {
          title: "At The Table",
          copy: "Welcome drink first, then menus once guests settle",
          icon: "+",
          sortOrder: 2,
        },
        {
          title: "Departure",
          copy: "A sincere thank-you, feedback, and a memorable final touch",
          icon: "~",
          sortOrder: 3,
        },
      ],
      primaryCtaLabel: "Enquire Now",
      primaryCtaHref: "#reservations",
      secondaryCtaLabel: "View Dining Spaces",
      secondaryCtaHref: "#gallery",
      isPublished: true,
    },
  },
  {
    model: Gallery,
    key: "gallery",
    data: {
      sectionKey: "gallery",
      heading: "Gallery",
      intro: "A glimpse into our world of flavours, ambiance, and unforgettable moments.",
      images: [
        { src: "/assets/chef5.png", alt: "Ikayi chef preparing a refined modern Indian plate", sortOrder: 1 },
        { src: "/assets/exp1.png", alt: "Signature Ikayi plated dessert served with dramatic presentation", sortOrder: 2 },
        { src: "/assets/exp4.png", alt: "Ikayi cocktail with small plates in the background", sortOrder: 3 },
        { src: "/assets/kitch1.png", alt: "Ikayi chef cooking over an open flame", sortOrder: 4 },
        { src: "/assets/exp3.png", alt: "Ikayi signature dish presented with warm table styling", sortOrder: 5 },
        { src: "/assets/kitch3.png", alt: "Guests watching the Ikayi open kitchen counter", sortOrder: 6 },
        { src: "/assets/exp2.png", alt: "Ikayi dish with herbs and cocktail styling", sortOrder: 7 },
        { src: "/assets/reservation%20(2).png", alt: "Ikayi reservation experience with dining collage", sortOrder: 8 },
        { src: "/assets/exp5.png", alt: "Creamy Ikayi cocktail with garnish", sortOrder: 9 },
        { src: "/assets/kitch2.png", alt: "Ikayi chef preparing dishes in the kitchen", sortOrder: 10 },
        { src: "/assets/chef9%20(2).png", alt: "Ikayi curry plated with Indian breads", sortOrder: 11 },
      ],
      ctaLabel: "Explore More Moments",
      ctaHref: "#stories",
      isPublished: true,
    },
  },
  {
    model: Reservation,
    key: "reservations",
    data: {
      sectionKey: "reservations",
      image: "/assets/reservation%20(2).png",
      imageAlt: "Ikayi reservation experience collage",
      tabs: ["Overview", "Reservations", "More Information", "Location"],
      details: ["The City Palace, Lucknow", "90-120 Minutes", "Tasting Experience"],
      title: "Six-Course Tasting Menu",
      priceLabel: "INR 4,800 ++",
      description:
        "An evening of refined indulgence. Our six-course tasting menu is a journey through seasonal ingredients, regional inspiration, and contemporary technique crafted to delight, surprise, and leave a lasting impression.",
      note: "Advance reservations are highly recommended to ensure a seamless dining experience.",
      bookingTitle: "Book Now",
      timeSlots: ["12:30 PM", "2:30 PM", "7:30 PM", "9:30 PM"],
      defaultGuests: 2,
      helperText: "You will be able to review and confirm your reservation on the next step.",
      primaryCtaLabel: "Check Availability",
      inquiryCtaLabel: "Send Inquiry",
      inquiryCtaHref: "/#reservations",
      policyLabel: "Cancellation Policy",
      policyHref: "#cancellation-policy",
      isPublished: true,
    },
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  for (const section of sections) {
    await section.model.findOneAndUpdate(
      { sectionKey: section.key },
      { $set: section.data },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`Seeded ${section.key}`);
  }

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
