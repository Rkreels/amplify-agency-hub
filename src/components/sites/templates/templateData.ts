
export const templates = [
  {
    id: 'business-pro',
    name: 'Business Pro',
    category: 'business',
    type: 'website' as const,
    description: 'Professional business website with service pages and contact forms',
    features: ['Contact Forms', 'Service Pages', 'Team Section', 'Testimonials'],
    rating: 4.8,
    isPremium: true,
    preview: '/templates/business-pro.jpg',
    elements: [
      {
        id: 'header-1',
        type: 'container',
        content: '',
        position: { x: 0, y: 0 },
        size: { width: '100%', height: 80 },
        styles: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        },
        children: ['logo-1', 'nav-1']
      },
      {
        id: 'hero-1',
        type: 'container',
        content: '',
        position: { x: 0, y: 80 },
        size: { width: '100%', height: 500 },
        styles: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem'
        },
        children: ['hero-content-1']
      }
    ]
  },
  {
    id: 'ecommerce-modern',
    name: 'Modern E-commerce',
    category: 'ecommerce',
    type: 'website' as const,
    description: 'Sleek e-commerce site with product catalog and shopping cart',
    features: ['Product Catalog', 'Shopping Cart', 'Payment Forms', 'User Reviews'],
    rating: 4.9,
    isPremium: true,
    preview: '/templates/ecommerce-modern.jpg',
    elements: []
  },
  {
    id: 'lead-gen-funnel',
    name: 'Lead Generation Funnel',
    category: 'business',
    type: 'funnel' as const,
    description: 'High-converting lead generation funnel with opt-in forms',
    features: ['Opt-in Forms', 'Thank You Pages', 'Email Integration', 'A/B Testing'],
    rating: 4.7,
    isPremium: false,
    preview: '/templates/lead-gen-funnel.jpg',
    elements: []
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    category: 'portfolio',
    type: 'website' as const,
    description: 'Stunning portfolio site for creatives and designers',
    features: ['Image Gallery', 'Project Showcase', 'Contact Form', 'Social Links'],
    rating: 4.6,
    isPremium: false,
    preview: '/templates/portfolio-creative.jpg',
    elements: []
  },
  {
    id: 'restaurant-deluxe',
    name: 'Restaurant Deluxe',
    category: 'restaurant',
    type: 'website' as const,
    description: 'Beautiful restaurant website with menu and reservations',
    features: ['Menu Display', 'Reservations', 'Photo Gallery', 'Location Map'],
    rating: 4.8,
    isPremium: true,
    preview: '/templates/restaurant-deluxe.jpg',
    elements: []
  },
  {
    id: 'agency-landing',
    name: 'Agency Landing',
    category: 'agency',
    type: 'landing' as const,
    description: 'Professional agency landing page with service showcase',
    features: ['Service Cards', 'Case Studies', 'Team Profiles', 'Contact CTA'],
    rating: 4.5,
    isPremium: false,
    preview: '/templates/agency-landing.jpg',
    elements: []
  },
  {
    id: 'booking-calendar',
    name: 'Booking Calendar',
    category: 'business',
    type: 'booking' as const,
    description: 'Appointment booking page with calendar integration',
    features: ['Calendar Widget', 'Time Slots', 'Payment Integration', 'Confirmations'],
    rating: 4.9,
    isPremium: true,
    preview: '/templates/booking-calendar.jpg',
    elements: []
  },
  {
    id: 'blog-minimal',
    name: 'Minimal Blog',
    category: 'blog',
    type: 'website' as const,
    description: 'Clean and minimal blog template with post listings',
    features: ['Post Grid', 'Categories', 'Search', 'Social Sharing'],
    rating: 4.4,
    isPremium: false,
    preview: '/templates/blog-minimal.jpg',
    elements: []
  }
];
