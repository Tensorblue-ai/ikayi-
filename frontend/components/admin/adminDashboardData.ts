import type { Booking, HomepageSection } from "./AdminDashboard";

export const initialSections: HomepageSection[] = [
  {
    id: "experience",
    title: "Hospitality before service",
    copy: "Every meal begins with a welcome.",
    summary:
      "IKAYI is built on oneness: guests, team, community, artisans, farmers, Lucknow, and India held as one thread. Every detail should feel warm, harmonious, and refined.",
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
    summary:
      "The open kitchen is an invitation for interaction and connection. Chefs engage with guests where appropriate, finishing touches may happen tableside, and each moment is guided so it feels intentional, not random.",
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
    summary:
      "Hospitality is one of the most powerful ways to bring people together. IKAYI belongs to Lucknow, and to those who come to discover it.",
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
    summary:
      "Signature moments shaped by warmth, rhythm, and recognition. These experiences are designed to make afternoons unhurried, sunsets memorable, and gatherings feel abundant without overwhelming conversation.",
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
    summary:
      "The guest journey begins when a reservation is made, not when someone reaches the door. Names and preferences should be captured so recognition feels natural.",
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
    summary: "A glimpse into our world of flavours, ambiance, and unforgettable moments.",
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
