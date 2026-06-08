import { Event, EventCategory } from "../types";

export const initialEvents: Event[] = [
  {
    id: "evt-001",
    title: "Neon Horizon music festival",
    description: "Experience the ultimate audio-visual journey with leading electronic music artists. Three stages of cutting-edge production, high-energy beats, and an unforgettable community atmosphere under neon skies.",
    category: EventCategory.FESTIVALS,
    date: "July 12, 2026",
    time: "4:00 PM - 2:00 AM",
    location: "Metro Arena Park, Baylands",
    city: "San Francisco",
    price: 89,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Vortex Entertainment",
    organizerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    totalTickets: 2500,
    soldTickets: 1845,
    featured: true,
    highlights: [
      "Access to 3 unique stages (Neon, Horizon, Pulse)",
      "Top-tier international DJ lineup",
      "Interactive digital art installations",
      "Gourmet food truck village & custom beverages"
    ]
  },
  {
    id: "evt-002",
    title: "Acoustic Sessions: Live & Intimate",
    description: "An exclusive acoustic performance featuring chart-topping indie artists in a historic candlelit hall. Savor the raw vocals, storytelling, and premium acoustic vibes with curated wine matches.",
    category: EventCategory.CONCERTS,
    date: "June 20, 2026",
    time: "7:30 PM - 10:30 PM",
    location: "The Chandelier Cathedral Room",
    city: "Boston",
    price: 45,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Acoustic Attic",
    organizerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    totalTickets: 400,
    soldTickets: 310,
    featured: true,
    highlights: [
      "Vibrant acoustic performances by award-winning singer-songwriters",
      "Complimentary wine tasting on arrival",
      "Intimate, historic candlelit church layout",
      "Q&A session with the main headliners"
    ]
  },
  {
    id: "evt-003",
    title: "Championship Bowl 2026",
    description: "The grand finale of the seasonal rugby tournament. Witness top gridiron squads battle for ultimate glory. Expect packed stands, local food, pre-game concerts, and extreme game-day energy.",
    category: EventCategory.SPORTS,
    date: "August 02, 2026",
    time: "1:00 PM - 6:00 PM",
    location: "Alliance Memorial Stadium",
    city: "Chicago",
    price: 65,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    organizerName: "National Sports League",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    totalTickets: 12000,
    soldTickets: 9800,
    featured: true,
    highlights: [
      "Unrivaled stadium atmosphere with 12k+ fans",
      "State-of-the-art giant screen coverage of replay reviews",
      "Access to the tailgate zone & games",
      "Exclusive event souvenir program booklet"
    ]
  },
  {
    id: "evt-004",
    title: "Metropolis: The Immersive Stage Play",
    description: "Step into an incredible reimagining of the sci-fi classical masterpiece. Combining physical acting, holographic projectors, and surround sound orchestration, this play pushes contemporary boundary lines.",
    category: EventCategory.THEATRE,
    date: "July 05, 2026",
    time: "8:00 PM - 10:30 PM",
    location: "Royal Odyssey Theatre",
    city: "New York",
    price: 75,
    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Vanguard Acting Guild",
    organizerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    totalTickets: 850,
    soldTickets: 640,
    featured: false,
    highlights: [
      "Multi-sensory surround sound audio engineering",
      "Stunning full-room augmented projection loops",
      "Includes post-show cast meeting and autograph pass",
      "High-comfort plush executive seating"
    ]
  },
  {
    id: "evt-005",
    title: "Tech Founders & Builders Summit",
    description: "Where founders, developers, and angel investors meet. A day packed with technical panels, interactive pitch feedback circles, and speed-networking to build the web of tomorrow.",
    category: EventCategory.COMMUNITY,
    date: "June 15, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Apex Glasshouse Hub",
    city: "San Francisco",
    price: 120,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Peak Ventures",
    organizerAvatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80",
    totalTickets: 500,
    soldTickets: 420,
    featured: false,
    highlights: [
      "Keynote sessions from elite unicorn scale-up founders",
      "Interactive roundtable mentorship workshops",
      "Catered business breakfast & networking buffet",
      "Exclusive access to the digital talent & investor matching app"
    ]
  },
  {
    id: "evt-006",
    title: "Sunsets & Symphony: Classical Remix",
    description: "A gorgeous sunset outdoor orchestral concert. Experience classical movements blended with modern beats and electronic backdrops at the edge of the pacific ocean cliffs.",
    category: EventCategory.CONCERTS,
    date: "August 18, 2026",
    time: "5:30 PM - 8:30 PM",
    location: "Cape Point Amphitheater",
    city: "Los Angeles",
    price: 55,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
    organizerName: "Symphonic Waves",
    organizerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    totalTickets: 1200,
    soldTickets: 580,
    featured: false,
    highlights: [
      "Stunning ocean cliffside amphitheater panoramic view",
      "Remixed orchestral scores by modern synthesizers",
      "Sunset photography station and complimentary polaroid",
      "Gourmet hot beverages & artisan dessert bites"
    ]
  }
];
