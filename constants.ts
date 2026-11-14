import { Event, EventCategory, TicketStatus, TicketType, User, UserRole } from "./types";

// Helper to generate specific dates and times
const getDate = (daysFromNow: number, hour: number, minute: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'user@example.com',
    role: UserRole.USER,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Neon Cyberpunk Rave',
    description: 'Experience the future of sound in this immersive cyberpunk themed rave featuring top electronic artists.',
    date: getDate(10, 22, 0), // 22:00
    location: 'Neo-Tokyo Arena, Sector 7',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 50,
    priceVip: 150,
    totalSeats: 2000,
    availableSeats: 1240
  },
  {
    id: 'e2',
    title: 'Global Tech Summit 2025',
    description: 'The biggest gathering of tech innovators, developers, and visionaries discussing AI and Quantum Computing.',
    date: getDate(25, 9, 0), // 09:00
    location: 'Silicon Valley Convention Center',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 299,
    priceVip: 599,
    totalSeats: 5000,
    availableSeats: 450
  },
  {
    id: 'e3',
    title: 'Champions League Final',
    description: 'The ultimate showdown of European football. The best clubs compete for the most prestigious trophy in the world at the Puskás Aréna.',
    date: '2026-05-30T20:00:00Z', // 30 May 2026
    location: 'Puskás Aréna, Budapest',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', // Realistic stadium night shot
    category: EventCategory.SPORTS,
    priceRegular: 450,
    priceVip: 2500,
    totalSeats: 67215,
    availableSeats: 0 // Sold out test
  },
  {
    id: 'e4',
    title: 'Modern Art Workshop',
    description: 'Learn from the masters of contemporary abstract art in this hands-on creative session.',
    date: getDate(15, 14, 30), // 14:30
    location: 'Downtown Gallery',
    image: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 45,
    priceVip: 90,
    totalSeats: 50,
    availableSeats: 42
  },
  {
    id: 'e5',
    title: 'Summer Jazz Festival',
    description: 'A weekend of smooth jazz under the stars featuring international legends.',
    date: getDate(30, 19, 30), // 19:30
    location: 'Central Park Amphitheater',
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e2729?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 60,
    priceVip: 180,
    totalSeats: 3000,
    availableSeats: 2100
  },
  {
    id: 'e6',
    title: 'Product Design Conference',
    description: 'Connect with UX/UI designers from around the world.',
    date: getDate(45, 10, 0), // 10:00
    location: 'Design Hub, London',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 150,
    priceVip: 300,
    totalSeats: 1000,
    availableSeats: 800
  },
  {
    id: 'e7',
    title: 'NBA: Lakers vs Celtics',
    description: 'Witness the classic rivalry in a spectacular NBA showdown at the main arena.',
    date: getDate(7, 19, 0), // 19:00
    location: 'Crypto.com Arena',
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
    category: EventCategory.SPORTS,
    priceRegular: 120,
    priceVip: 450,
    totalSeats: 19000,
    availableSeats: 2500
  },
  {
    id: 'e8',
    title: 'Hamlet - Live Performance',
    description: 'A modern adaptation of Shakespeare’s classic tragedy.',
    date: getDate(20, 20, 0), // 20:00
    location: 'Royal Theater',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80',
    category: EventCategory.THEATER,
    priceRegular: 55,
    priceVip: 110,
    totalSeats: 800,
    availableSeats: 150
  },
  {
    id: 'e9',
    title: 'Culinary Masterclass',
    description: 'Cook with Michelin star chefs and learn the secrets of fine dining.',
    date: getDate(12, 11, 0), // 11:00
    location: 'Culinary Institute',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 200,
    priceVip: 350,
    totalSeats: 20,
    availableSeats: 5
  },
  {
    id: 'e10',
    title: 'Indie Rock Night',
    description: 'Discover the best upcoming indie bands in an intimate setting.',
    date: getDate(3, 21, 0), // 21:00
    location: 'The Basement Club',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 25,
    priceVip: 60,
    totalSeats: 300,
    availableSeats: 120
  },
  {
    id: 'e11',
    title: 'International Film Festival',
    description: 'Screening award-winning independent films from around the globe.',
    date: getDate(60, 17, 0), // 17:00
    location: 'Cinema Paradiso',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    category: EventCategory.THEATER,
    priceRegular: 35,
    priceVip: 70,
    totalSeats: 500,
    availableSeats: 250
  },
  {
    id: 'e12',
    title: 'City Marathon 2025',
    description: 'Join thousands of runners in the annual city marathon.',
    date: getDate(40, 7, 0), // 07:00
    location: 'City Center Start Line',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80',
    category: EventCategory.SPORTS,
    priceRegular: 100,
    priceVip: 200,
    totalSeats: 10000,
    availableSeats: 8000
  },
  {
    id: 'e13',
    title: 'AI & Robotics Expo',
    description: 'Witness the next generation of robotics and artificial intelligence in action.',
    date: getDate(18, 9, 30), // 09:30
    location: 'Tech Hub Convention Center',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 150,
    priceVip: 400,
    totalSeats: 3000,
    availableSeats: 1500
  },
  {
    id: 'e14',
    title: 'Classic Rock Revival',
    description: 'Relive the golden age of rock with tribute bands and legendary guest appearances.',
    date: getDate(22, 20, 30), // 20:30
    location: 'Red Rocks Amphitheatre',
    image: 'https://images.unsplash.com/photo-1543324546-aa4b2165f7c3?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 75,
    priceVip: 200,
    totalSeats: 9000,
    availableSeats: 4500
  },
  {
    id: 'e15',
    title: 'Grand Slam Tennis Open',
    description: 'Watch the world\'s best tennis players compete for the championship title.',
    date: getDate(35, 13, 0), // 13:00
    location: 'National Tennis Center',
    image: 'https://images.unsplash.com/photo-1599474924187-334a405be2fa?w=800&q=80',
    category: EventCategory.SPORTS,
    priceRegular: 120,
    priceVip: 500,
    totalSeats: 15000,
    availableSeats: 2000
  },
  {
    id: 'e16',
    title: 'Immersive Van Gogh',
    description: 'Step inside the paintings of Vincent van Gogh in this digital art experience.',
    date: getDate(50, 10, 0), // 10:00
    location: 'City Art Museum',
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 40,
    priceVip: 80,
    totalSeats: 200,
    availableSeats: 180
  },
  {
    id: 'e17',
    title: 'Stand-up Comedy Night',
    description: 'A night of laughter featuring the funniest stand-up comedians in the country.',
    date: getDate(8, 21, 30), // 21:30
    location: 'The Laugh Factory',
    image: 'https://images.unsplash.com/photo-1565720478791-c967664c39bd?w=800&q=80',
    category: EventCategory.THEATER,
    priceRegular: 30,
    priceVip: 60,
    totalSeats: 400,
    availableSeats: 50
  },
  {
    id: 'e18',
    title: 'Blockchain World Forum',
    description: 'Discussing the future of decentralized finance and cryptocurrency.',
    date: getDate(55, 8, 30), // 08:30
    location: 'Financial District Hotel',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 499,
    priceVip: 999,
    totalSeats: 1000,
    availableSeats: 800
  },
  {
    id: 'e19',
    title: 'Symphony Orchestra Gala',
    description: 'An elegant evening of classical masterpieces performed by the Royal Orchestra.',
    date: getDate(28, 19, 0), // 19:00
    location: 'Opera House',
    image: 'https://images.unsplash.com/photo-1514119977933-92dd2835a28e?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 90,
    priceVip: 250,
    totalSeats: 1800,
    availableSeats: 900
  },
  {
    id: 'e20',
    title: 'Street Food Carnival',
    description: 'Taste dishes from around the world at this bustling outdoor food market.',
    date: getDate(14, 12, 0), // 12:00
    location: 'Waterfront Park',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 15,
    priceVip: 45,
    totalSeats: 5000,
    availableSeats: 4000
  },
  {
    id: 'e21',
    title: 'Yoga & Mindfulness Retreat',
    description: 'Reconnect with your inner self in this weekend-long wellness retreat.',
    date: getDate(32, 6, 0), // 06:00
    location: 'Mountain Serenity Resort',
    image: 'https://images.unsplash.com/photo-1588286840104-4bd54803d105?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 300,
    priceVip: 600,
    totalSeats: 50,
    availableSeats: 10
  },
  {
    id: 'e22',
    title: 'Cyber Security Summit',
    description: 'Learn how to protect digital assets from the world\'s leading security experts.',
    date: getDate(42, 9, 0), // 09:00
    location: 'Cyber Center',
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 350,
    priceVip: 700,
    totalSeats: 800,
    availableSeats: 600
  },
  {
    id: 'e23',
    title: 'Heavy Metal Mayhem',
    description: 'Headbanging beats and electric atmosphere for metal heads.',
    date: getDate(38, 20, 0), // 20:00
    location: 'The Iron Warehouse',
    image: 'https://images.unsplash.com/photo-1534351394178-5a7a8f946059?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 40,
    priceVip: 100,
    totalSeats: 1500,
    availableSeats: 800
  },
  {
    id: 'e24',
    title: 'Contemporary Dance Show',
    description: 'A mesmerizing performance blending modern movement and visual art.',
    date: getDate(21, 19, 30), // 19:30
    location: 'Arts Center',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
    category: EventCategory.THEATER,
    priceRegular: 45,
    priceVip: 90,
    totalSeats: 600,
    availableSeats: 300
  },
  {
    id: 'e25',
    title: 'Formula Racing Grand Prix',
    description: 'High speed action at the most prestigious racing event of the year.',
    date: getDate(65, 14, 0), // 14:00
    location: 'International Circuit',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    category: EventCategory.SPORTS,
    priceRegular: 200,
    priceVip: 1500,
    totalSeats: 80000,
    availableSeats: 25000
  },
  {
    id: 'e26',
    title: 'Pottery & Clay Workshop',
    description: 'Get your hands dirty and create beautiful ceramic pieces.',
    date: getDate(9, 15, 0), // 15:00
    location: 'Creative Arts Studio',
    image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 65,
    priceVip: 100,
    totalSeats: 15,
    availableSeats: 8
  },
  {
    id: 'e27',
    title: 'Indie Game Developers Meetup',
    description: 'Networking and showcase event for independent game creators.',
    date: getDate(27, 18, 0), // 18:00
    location: 'Pixel Lounge',
    image: 'https://images.unsplash.com/photo-1556438050-bf3943752e86?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 25,
    priceVip: 50,
    totalSeats: 200,
    availableSeats: 150
  },
  {
    id: 'e28',
    title: 'Reggae Beach Party',
    description: 'Chill vibes, good music, and ocean breeze all night long.',
    date: getDate(16, 16, 0), // 16:00
    location: 'Sunset Beach Club',
    image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
    category: EventCategory.CONCERT,
    priceRegular: 35,
    priceVip: 80,
    totalSeats: 1000,
    availableSeats: 600
  },
  {
    id: 'e29',
    title: 'Magic & Illusion Night',
    description: 'Prepare to be amazed by mind-bending tricks and illusions.',
    date: getDate(19, 20, 0), // 20:00
    location: 'Mystic Theater',
    image: 'https://images.unsplash.com/photo-1504583561331-50e417730eb6?w=800&q=80',
    category: EventCategory.THEATER,
    priceRegular: 50,
    priceVip: 100,
    totalSeats: 300,
    availableSeats: 120
  },
  {
    id: 'e30',
    title: 'Sustainable Energy Expo',
    description: 'Discover the latest innovations in solar, wind, and green energy.',
    date: getDate(48, 10, 0), // 10:00
    location: 'Eco Convention Hall',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    category: EventCategory.CONFERENCE,
    priceRegular: 50,
    priceVip: 150,
    totalSeats: 2000,
    availableSeats: 1800
  },
  {
    id: 'e31',
    title: 'Fine Wine Tasting',
    description: 'Sample premium wines from top vineyards with expert sommeliers.',
    date: getDate(23, 18, 30), // 18:30
    location: 'Vintage Cellars',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 85,
    priceVip: 150,
    totalSeats: 30,
    availableSeats: 12
  },
  {
    id: 'e32',
    title: 'Coffee Brewing Masterclass',
    description: 'Learn the art of the perfect brew from bean to cup.',
    date: getDate(11, 10, 0), // 10:00
    location: 'The Roast House',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 55,
    priceVip: 90,
    totalSeats: 20,
    availableSeats: 5
  },
  {
    id: 'e33',
    title: 'Photography Walk',
    description: 'Capture the city\'s hidden gems with professional guidance.',
    date: getDate(13, 16, 30), // 16:30
    location: 'City Center Plaza',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&q=80',
    category: EventCategory.WORKSHOP,
    priceRegular: 40,
    priceVip: 70,
    totalSeats: 25,
    availableSeats: 20
  }
];