import type { Booking, HomepageSection } from "./AdminDashboard";

export const initialSections: HomepageSection[] = [
  {
    id: "experience",
    title: "Hospitality before service",
    copy: "Every meal begins with a welcome.",
    layout: "Guest feelings",
    status: "published",
    items: [
      { title: "Welcomed", copy: "Expected, recognised and genuinely cared for" },
      { title: "Celebrated", copy: "Personal, thoughtful and occasion-led" },
      { title: "Calm", copy: "Unhurried, easy and without performance" },
      { title: "Connected", copy: "Guests, team, community and craft" },
    ],
  },
  {
    id: "kitchen",
    title: "Open Kitchen Experience",
    copy: "Interaction, connection and tableside finishing touches.",
    layout: "Image collage",
    status: "published",
    items: [
      { title: "Open flame", copy: "Chef-led cooking moments" },
      { title: "Plating", copy: "Finishing touches in view" },
      { title: "Counter", copy: "Guests watching the kitchen" },
      { title: "Garnish", copy: "Final detail before service" },
    ],
  },
  {
    id: "stories",
    title: "Stories",
    copy: "IKAYI belongs to Lucknow, and to those who come to discover it.",
    layout: "Story cards",
    status: "published",
    items: [
      { title: "Rooted", copy: "Close to land, food and stories" },
      { title: "Warm", copy: "Welcomed like someone home" },
      { title: "Refined", copy: "Excellence over excess" },
      { title: "Curious", copy: "More honest and thoughtful" },
    ],
  },
  {
    id: "signature",
    title: "Signature Experiences",
    copy: "High tea, rituals, brunch and welcome gestures.",
    layout: "Experience cards",
    status: "published",
    items: [
      { title: "Ikayi High Tea", copy: "Elegant afternoon pause" },
      { title: "Veranda Ritual", copy: "Sunset cocktails and small bites" },
      { title: "Ikayi Brunch", copy: "Sharing-style abundance" },
      { title: "Welcome Ritual", copy: "A signature IKAYI gesture" },
    ],
  },
  {
    id: "guest-journey",
    title: "From Reservation To Departure",
    copy: "Names and preferences remembered from the first booking.",
    layout: "Journey highlights",
    status: "published",
    items: [
      { title: "Arrival", copy: "Reservation details remembered" },
      { title: "At The Table", copy: "Welcome drink before menus" },
      { title: "Departure", copy: "Thank-you, feedback and final touch" },
    ],
  },
  {
    id: "gallery",
    title: "Gallery",
    copy: "A glimpse into flavours, ambiance and memorable moments.",
    layout: "Image grid",
    status: "published",
    items: [
      { title: "Chef plates", copy: "Refined modern Indian dishes" },
      { title: "Ambiance", copy: "Warm table styling" },
      { title: "Kitchen", copy: "Open flame and preparation" },
      { title: "Architecture", copy: "Lucknow-inspired details" },
    ],
  },
];

export const bookings: Booking[] = [];
