export interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  averageRating: number;
  numReviews: number;
  vendorId: {
    _id: string;
    name: string;
    businessName: string;
    image?: string;
    subscriptionPlan?: string;
    email?: string;
  };
}

export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    _id: '67401a011000000000000001',
    itemName: 'Margherita Classica',
    category: 'Classic Pizzas',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil.',
    price: 14.99,
    location: 'Downtown Brooklyn, NY',
    images: [
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    ],
    status: 'approved',
    averageRating: 4.9,
    numReviews: 24,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000002',
    itemName: 'Pepperoni Inferno',
    category: 'Classic Pizzas',
    description: 'Loaded with hand-cut spicy pepperoni cups, mozzarella blend, crushed red pepper, and honey drizzle.',
    price: 17.5,
    location: 'Downtown Brooklyn, NY',
    images: [
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800',
    ],
    status: 'approved',
    averageRating: 4.8,
    numReviews: 31,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000003',
    itemName: 'Garden Veggie Supreme',
    category: 'Vegetarian Pizzas',
    description: 'Roasted bell peppers, caramelized red onions, baby spinach, kalamata olives, button mushrooms, and fontina.',
    price: 16.0,
    location: 'Greenwich Village, NY',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    ],
    status: 'approved',
    averageRating: 4.7,
    numReviews: 18,
    vendorId: {
      _id: 'vendor_luigi_2',
      name: 'Luigi Moretti',
      businessName: "Luigi's Wood-Fired Slice",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      subscriptionPlan: 'free',
      email: 'luigi@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000004',
    itemName: 'Quattro Formaggi Bianca',
    category: 'Vegetarian Pizzas',
    description: 'White garlic base, aged provolone, fior di latte, gorgonzola dolce, and freshly grated pecorino romano.',
    price: 18.25,
    location: 'Greenwich Village, NY',
    images: ['https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800'],
    status: 'approved',
    averageRating: 4.9,
    numReviews: 15,
    vendorId: {
      _id: 'vendor_luigi_2',
      name: 'Luigi Moretti',
      businessName: "Luigi's Wood-Fired Slice",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      subscriptionPlan: 'free',
      email: 'luigi@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000005',
    itemName: 'Carnivore Meat Feast',
    category: 'Meat Lovers',
    description: 'Smoky bacon lardons, Italian spicy sausage, smoked ham, seasoned ground beef, and signature BBQ glaze.',
    price: 19.99,
    location: 'Downtown Brooklyn, NY',
    images: ['https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800'],
    status: 'approved',
    averageRating: 4.9,
    numReviews: 42,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000006',
    itemName: 'Truffle Mushroom Gourmet',
    category: 'Specialty / Gourmet Pizzas',
    description: 'Wild forest chanterelles, porcini cream, white truffle oil, shaved parmigiano, and organic thyme.',
    price: 22.5,
    location: 'Downtown Brooklyn, NY',
    images: ['https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800'],
    status: 'approved',
    averageRating: 5.0,
    numReviews: 29,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000007',
    itemName: 'Golden Garlic Parmesan Knots',
    category: 'Sides & Appetizers',
    description: '6 oven-baked dough knots tossed in roasted garlic herb butter, grated parmesan, with warm marinara dip.',
    price: 7.99,
    location: 'Greenwich Village, NY',
    images: ['https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800'],
    status: 'approved',
    averageRating: 4.6,
    numReviews: 19,
    vendorId: {
      _id: 'vendor_luigi_2',
      name: 'Luigi Moretti',
      businessName: "Luigi's Wood-Fired Slice",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      subscriptionPlan: 'free',
      email: 'luigi@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000008',
    itemName: 'Crispy Buffalo Wings (8pcs)',
    category: 'Sides & Appetizers',
    description: 'Jumbo wings tossed in spicy tang Buffalo glaze, served with fresh celery sticks and homemade blue cheese dip.',
    price: 11.5,
    location: 'Downtown Brooklyn, NY',
    images: ['https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800'],
    status: 'approved',
    averageRating: 4.8,
    numReviews: 25,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000009',
    itemName: 'Authentic Italian Tiramisu',
    category: 'Beverages & Desserts',
    description: 'Espresso-soaked savoiardi ladyfingers layered with rich mascarpone zabaglione and dusted with dark cocoa.',
    price: 8.5,
    location: 'Downtown Brooklyn, NY',
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800'],
    status: 'approved',
    averageRating: 4.9,
    numReviews: 33,
    vendorId: {
      _id: 'vendor_mario_1',
      name: 'Mario Rossi',
      businessName: "Mario's Authentic Pizzeria",
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      subscriptionPlan: 'premium',
      email: 'mario@pizzahub.com',
    },
  },
  {
    _id: '67401a011000000000000010',
    itemName: 'Sparkling Blood Orange Aranciata',
    category: 'Beverages & Desserts',
    description: 'Chilled authentic San Pellegrino artisan sparkling soda made with Sicilian blood oranges (330ml).',
    price: 3.5,
    location: 'Greenwich Village, NY',
    images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800'],
    status: 'approved',
    averageRating: 4.7,
    numReviews: 12,
    vendorId: {
      _id: 'vendor_luigi_2',
      name: 'Luigi Moretti',
      businessName: "Luigi's Wood-Fired Slice",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      subscriptionPlan: 'free',
      email: 'luigi@pizzahub.com',
    },
  },
];
