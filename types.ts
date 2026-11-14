
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TicketType {
  REGULAR = 'REGULAR',
  VIP = 'VIP'
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
  REFUND_REQUESTED = 'REFUND_REQUESTED'
}

export enum EventCategory {
  CONCERT = 'Concert',
  CONFERENCE = 'Conference',
  SPORTS = 'Sports',
  THEATER = 'Theater',
  WORKSHOP = 'Workshop'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  age?: number;
  bio?: string;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO String
  location: string;
  image: string;
  category: EventCategory;
  priceRegular: number;
  priceVip: number;
  totalSeats: number;
  availableSeats: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  type: TicketType;
  price: number;
  status: TicketStatus;
  purchaseDate: string;
  qrCode: string;
  seat?: string;
  refundReason?: string;
}

export interface Booking {
  id: string;
  userId: string;
  ticketIds: string[];
  totalAmount: number;
  date: string;
}

export interface StatData {
  name: string;
  value: number;
}