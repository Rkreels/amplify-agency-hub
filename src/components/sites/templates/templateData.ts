
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  isPremium: boolean;
  elements: any[];
  preview: {
    desktop: string;
    mobile: string;
  };
}

export const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'High-Converting Landing Page',
    description: 'Perfect for product launches and lead generation',
    category: 'Landing Pages',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: [
      {
        id: 'hero-heading',
        type: 'heading',
        content: 'Transform Your Business Today',
        position: { x: 50, y: 80 },
        size: { width: 700, height: 100 },
        styles: {
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          lineHeight: '1.2',
          marginBottom: '20px'
        },
        props: { level: 'h1' },
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        content: 'Join thousands of successful businesses who have already transformed their operations with our proven system.',
        position: { x: 100, y: 200 },
        size: { width: 600, height: 80 },
        styles: {
          fontSize: '20px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '30px'
        },
        props: {},
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'hero-cta',
        type: 'button',
        content: 'Get Started Free',
        position: { x: 325, y: 300 },
        size: { width: 200, height: 60 },
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        },
        props: { href: '#signup' },
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'features-heading',
        type: 'heading',
        content: 'Why Choose Our Solution?',
        position: { x: 50, y: 450 },
        size: { width: 700, height: 60 },
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '40px'
        },
        props: { level: 'h2' },
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'feature-1',
        type: 'container',
        content: '',
        position: { x: 50, y: 550 },
        size: { width: 220, height: 200 },
        styles: {
          backgroundColor: '#f9fafb',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        },
        props: {},
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'testimonial-section',
        type: 'container',
        content: '',
        position: { x: 50, y: 800 },
        size: { width: 700, height: 250 },
        styles: {
          backgroundColor: '#f8fafc',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        },
        props: {},
        children: [],
        attributes: {},
        layerId: 'default'
      }
    ]
  },
  {
    id: 'business-form',
    name: 'Lead Generation Form',
    description: 'Capture leads with this conversion-optimized form',
    category: 'Forms',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: [
      {
        id: 'form-title',
        type: 'heading',
        content: 'Get Your Free Consultation',
        position: { x: 200, y: 80 },
        size: { width: 400, height: 80 },
        styles: {
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '20px'
        },
        props: { level: 'h1' },
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'form-subtitle',
        type: 'text',
        content: 'Fill out the form below and our experts will contact you within 24 hours.',
        position: { x: 150, y: 180 },
        size: { width: 500, height: 50 },
        styles: {
          fontSize: '18px',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '1.5',
          marginBottom: '30px'
        },
        props: {},
        children: [],
        attributes: {},
        layerId: 'default'
      },
      {
        id: 'lead-form',
        type: 'form',
        content: '',
        position: { x: 200, y: 260 },
        size: { width: 400, height: 400 },
        styles: {
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        },
        props: {
          action: '/submit-lead',
          method: 'POST'
        },
        children: [],
        attributes: {},
        layerId: 'default'
      }
    ]
  },
  {
    id: 'ecommerce-product',
    name: 'Product Showcase',
    description: 'Beautiful product display with purchase options',
    category: 'E-commerce',
    image: '/api/placeholder/400/300',
    isPremium: true,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: [
      {
        id: 'product-hero',
        type: 'container',
        content: '',
        position: { x: 50, y: 80 },
        size: { width: 700, height: 400 },
        styles: {
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        },
        props: {},
        children: [],
        attributes: {},
        layerId: 'default'
      }
    ]
  },
  {
    id: 'agency-portfolio',
    name: 'Agency Portfolio',
    description: 'Showcase your work and attract new clients',
    category: 'Portfolio',
    image: '/api/placeholder/400/300',
    isPremium: true,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Digital menu with ordering capabilities',
    category: 'Restaurant',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    description: 'Personal trainer booking and program showcase',
    category: 'Fitness',
    image: '/api/placeholder/400/300',
    isPremium: true,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'real-estate',
    name: 'Real Estate Listing',
    description: 'Property showcase with inquiry form',
    category: 'Real Estate',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'law-firm',
    name: 'Law Firm',
    description: 'Professional legal services presentation',
    category: 'Professional',
    image: '/api/placeholder/400/300',
    isPremium: true,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'medical-practice',
    name: 'Medical Practice',
    description: 'Healthcare provider with appointment booking',
    category: 'Healthcare',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'Software as a Service product presentation',
    category: 'SaaS',
    image: '/api/placeholder/400/300',
    isPremium: true,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Event details with registration form',
    category: 'Events',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  },
  {
    id: 'nonprofit-donation',
    name: 'Nonprofit Donation',
    description: 'Charity organization with donation options',
    category: 'Nonprofit',
    image: '/api/placeholder/400/300',
    isPremium: false,
    preview: {
      desktop: '/api/placeholder/800/600',
      mobile: '/api/placeholder/400/600'
    },
    elements: []
  }
];

export const categories = [
  'All',
  'Landing Pages',
  'Forms',
  'E-commerce',
  'Portfolio',
  'Restaurant',
  'Fitness',
  'Real Estate',
  'Professional',
  'Healthcare',
  'SaaS',
  'Events',
  'Nonprofit'
];
