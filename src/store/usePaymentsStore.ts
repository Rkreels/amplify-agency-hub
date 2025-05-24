
import { create } from 'zustand';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  items: Omit<InvoiceItem, 'id'>[];
  paymentTerms: string;
  notes: string;
}

export interface Transaction {
  id: string;
  invoiceId?: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  type: 'invoice' | 'payment' | 'refund';
}

interface PaymentsStore {
  invoices: Invoice[];
  templates: InvoiceTemplate[];
  transactions: Transaction[];
  selectedInvoice: Invoice | null;
  searchQuery: string;
  statusFilter: string;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addTemplate: (template: Omit<InvoiceTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
    clientAddress: '123 Main St, City, State 12345',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'sent',
    items: [
      {
        id: '1',
        description: 'Website Design',
        quantity: 1,
        rate: 2500,
        amount: 2500
      }
    ],
    subtotal: 2500,
    tax: 250,
    total: 2750
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientName: 'Michael Brown',
    clientEmail: 'michael@example.com',
    clientAddress: '456 Oak Ave, City, State 67890',
    issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    status: 'paid',
    items: [
      {
        id: '2',
        description: 'Marketing Campaign',
        quantity: 1,
        rate: 1500,
        amount: 1500
      }
    ],
    subtotal: 1500,
    tax: 150,
    total: 1650
  }
];

const mockTemplates: InvoiceTemplate[] = [
  {
    id: '1',
    name: 'Website Development',
    description: 'Standard website development invoice',
    items: [
      {
        description: 'Website Design',
        quantity: 1,
        rate: 2500,
        amount: 2500
      },
      {
        description: 'Development',
        quantity: 1,
        rate: 3500,
        amount: 3500
      }
    ],
    paymentTerms: 'Net 30',
    notes: 'Thank you for your business!'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    customer: 'Sarah Johnson',
    amount: 2500,
    status: 'completed',
    date: '2025-05-20',
    method: 'Credit Card',
    type: 'payment'
  },
  {
    id: '2',
    customer: 'Michael Brown',
    amount: 1500,
    status: 'pending',
    date: '2025-05-19',
    method: 'Bank Transfer',
    type: 'invoice'
  }
];

export const usePaymentsStore = create<PaymentsStore>((set, get) => ({
  invoices: mockInvoices,
  templates: mockTemplates,
  transactions: mockTransactions,
  selectedInvoice: null,
  searchQuery: '',
  statusFilter: 'all',
  
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, { ...invoice, id: Date.now().toString() }]
  })),
  
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...updates } : invoice
    )
  })),
  
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(invoice => invoice.id !== id)
  })),
  
  addTemplate: (template) => set((state) => ({
    templates: [...state.templates, { ...template, id: Date.now().toString() }]
  })),
  
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(template => template.id !== id)
  })),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
  }))
}));
