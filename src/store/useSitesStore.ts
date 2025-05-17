
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type SiteStatus = 'published' | 'draft' | 'archived';
export type SiteType = 'website' | 'landing' | 'funnel' | 'booking';

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  content?: Record<string, any>;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  status: SiteStatus;
  type: SiteType;
  lastUpdated: Date;
  visitors: number;
  pages: SitePage[];
  createdAt: Date;
  thumbnail?: string;
  description?: string;
}

interface SitesStore {
  sites: Site[];
  selectedSite: Site | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD Actions
  addSite: (site: Omit<Site, 'id' | 'createdAt' | 'lastUpdated' | 'visitors'>) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  deleteSite: (id: string) => void;
  getSiteById: (id: string) => Site | undefined;
  
  // Page CRUD
  addPage: (siteId: string, page: Omit<SitePage, 'id'>) => void;
  updatePage: (siteId: string, pageId: string, updates: Partial<SitePage>) => void;
  deletePage: (siteId: string, pageId: string) => void;
  
  // Selection
  setSelectedSite: (site: Site | null) => void;
  publishSite: (id: string) => void;
  unpublishSite: (id: string) => void;
}

// Sample data
const sampleSites: Site[] = [
  {
    id: uuidv4(),
    name: "Main Marketing Site",
    url: "www.youragency.com",
    status: "published",
    type: "website",
    lastUpdated: new Date("2025-05-15"),
    visitors: 1245,
    createdAt: new Date("2025-01-10"),
    pages: [
      {
        id: uuidv4(),
        title: "Home",
        slug: "/",
        isPublished: true,
      },
      {
        id: uuidv4(),
        title: "About Us",
        slug: "/about",
        isPublished: true,
      },
      {
        id: uuidv4(),
        title: "Services",
        slug: "/services",
        isPublished: true,
      },
      {
        id: uuidv4(),
        title: "Contact",
        slug: "/contact",
        isPublished: true,
      }
    ],
    description: "Main company website with information about services",
  },
  {
    id: uuidv4(),
    name: "Client Booking Page",
    url: "booking.youragency.com",
    status: "published",
    type: "booking",
    lastUpdated: new Date("2025-05-10"),
    visitors: 856,
    createdAt: new Date("2025-02-20"),
    pages: [
      {
        id: uuidv4(),
        title: "Booking",
        slug: "/",
        isPublished: true,
      },
      {
        id: uuidv4(),
        title: "Confirmation",
        slug: "/confirmation",
        isPublished: true,
      },
      {
        id: uuidv4(),
        title: "Cancel",
        slug: "/cancel",
        isPublished: true,
      }
    ],
    description: "Booking page for client consultations",
  },
  {
    id: uuidv4(),
    name: "Black Friday Landing Page",
    url: "promo.youragency.com/black-friday",
    status: "draft",
    type: "landing",
    lastUpdated: new Date("2025-05-17"),
    visitors: 0,
    createdAt: new Date("2025-05-01"),
    pages: [
      {
        id: uuidv4(),
        title: "Black Friday Offer",
        slug: "/",
        isPublished: false,
      }
    ],
    description: "Special promotion for Black Friday sales",
  },
];

export const useSitesStore = create<SitesStore>()(
  persist(
    (set, get) => ({
      sites: sampleSites,
      selectedSite: null,
      isLoading: false,
      error: null,
      
      // CRUD Actions
      addSite: (siteData) => {
        const newSite: Site = {
          ...siteData,
          id: uuidv4(),
          createdAt: new Date(),
          lastUpdated: new Date(),
          visitors: 0,
        };
        
        set((state) => ({
          sites: [...state.sites, newSite],
        }));
      },
      
      updateSite: (id, updates) => {
        set((state) => ({
          sites: state.sites.map((site) => 
            site.id === id ? { ...site, ...updates, lastUpdated: new Date() } : site
          ),
        }));
      },
      
      deleteSite: (id) => {
        set((state) => ({
          sites: state.sites.filter((site) => site.id !== id),
          selectedSite: state.selectedSite?.id === id ? null : state.selectedSite,
        }));
      },
      
      getSiteById: (id) => {
        return get().sites.find((site) => site.id === id);
      },
      
      // Page CRUD
      addPage: (siteId, page) => {
        set((state) => ({
          sites: state.sites.map((site) => {
            if (site.id === siteId) {
              return {
                ...site,
                pages: [...site.pages, { ...page, id: uuidv4() }],
                lastUpdated: new Date()
              };
            }
            return site;
          }),
        }));
      },
      
      updatePage: (siteId, pageId, updates) => {
        set((state) => ({
          sites: state.sites.map((site) => {
            if (site.id === siteId) {
              return {
                ...site,
                pages: site.pages.map((page) => 
                  page.id === pageId ? { ...page, ...updates } : page
                ),
                lastUpdated: new Date()
              };
            }
            return site;
          }),
        }));
      },
      
      deletePage: (siteId, pageId) => {
        set((state) => ({
          sites: state.sites.map((site) => {
            if (site.id === siteId) {
              return {
                ...site,
                pages: site.pages.filter((page) => page.id !== pageId),
                lastUpdated: new Date()
              };
            }
            return site;
          }),
        }));
      },
      
      // Selection
      setSelectedSite: (site) => {
        set({ selectedSite: site });
      },
      
      publishSite: (id) => {
        set((state) => ({
          sites: state.sites.map((site) => {
            if (site.id === id) {
              return {
                ...site,
                status: 'published',
                lastUpdated: new Date()
              };
            }
            return site;
          }),
        }));
      },
      
      unpublishSite: (id) => {
        set((state) => ({
          sites: state.sites.map((site) => {
            if (site.id === id) {
              return {
                ...site,
                status: 'draft',
                lastUpdated: new Date()
              };
            }
            return site;
          }),
        }));
      },
    }),
    {
      name: 'sites-store',
      partialize: (state) => ({
        sites: state.sites,
      }),
    }
  )
);
