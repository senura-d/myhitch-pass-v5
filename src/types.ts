export enum EventCategory {
  CONCERTS = "Concerts",
  FESTIVALS = "Festivals",
  SPORTS = "Sports",
  THEATRE = "Theatre & Arts",
  COMMUNITY = "Community & Tech"
}

export enum TicketStatus {
  UPCOMING = "Upcoming",
  PAST = "Past",
  CANCELLED = "Cancelled",
  DRAFT = "Draft"
}

export interface TicketType {
  id: string;
  name: string;
  description: string | null;
  price_aud: number;
  quantity_total: number;
  quantity_sold: number;
  available: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // ISO format "YYYY-MM-DD" Or display format
  time: string;
  location: string;
  city: string;
  price: number;
  image: string;
  organizerName: string;
  organizerAvatar: string;
  totalTickets: number;
  soldTickets: number;
  featured: boolean;
  highlights: string[];
  ticketTypes?: TicketType[];
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  qrCodeValue: string;
  status: TicketStatus;
  attendeeName: string;
  attendeeEmail: string;
  purchaseDate: string;
  seatType: string;
  price: number;
  quantity: number;
}

export interface BookingDetails {
  eventId: string;
  quantity: number;
  seatType: string;
  attendeeName: string;
  attendeeEmail: string;
}

export interface OrganizerStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  activeEvents: number;
}

export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  seatType: string;
  ticketTypeId?: string;
  quantity: number;
  unitPrice: number;
  addedAt?: number; // unix ms timestamp — items older than 7 days are dropped
}
