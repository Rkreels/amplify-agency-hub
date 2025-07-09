
import { create } from 'zustand';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdDate: Date;
  paidDate?: Date;
  notes?: string;
  terms?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe' | 'cash';
  type: 'payment' | 'refund' | 'subscription';
  date: string;
  invoiceId?: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal' | 'square' | 'authorize_net';
  name: string;
  isActive: boolean;
  settings: Record<string, any>;
}

interface PaymentsStore {
  invoices: Invoice[];
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  searchQuery: string;
  statusFilter: string;
  selectedInvoice: Invoice | null;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdDate'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => void;
  sendInvoice: (id: string) => void;
  markInvoicePaid: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  generateInvoiceNumber: () => string;
}

export const usePaymentsStore = create<PaymentsStore>((set, get) => ({
  invoices: [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      clientName: 'John Smith',
      clientEmail: 'john@example.com',
      clientAddress: '123 Main St, City, State 12345',
      items: [
        {
          id: '1',
          description: 'Website Design',
          quantity: 1,
          rate: 2500,
          amount: 2500
        },
        {
          id: '2',
          description: 'SEO Setup',
          quantity: 1,
          rate: 800,
          amount: 800
        }
      ],
      subtotal: 3300,
      tax: 264,
      total: 3564,
      status: 'sent',
      dueDate: new Date('2024-12-30'),
      createdDate: new Date('2024-12-01'),
      notes: 'Payment due within 30 days'
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      clientName: 'Jane Doe',
      clientEmail: 'jane@company.com',
      clientAddress: '456 Oak Ave, City, State 67890',
      items: [
        {
          id: '3',
          description: 'Monthly Retainer',
          quantity: 1,
          rate: 1500,
          amount: 1500
        }
      ],
      subtotal: 1500,
      tax: 120,
      total: 1620,
      status: 'paid',
      dueDate: new Date('2024-12-15'),
      createdDate: new Date('2024-11-15'),
      paidDate: new Date('2024-12-10')
    }
  ],
  transactions: [
    {
      id: '1',
      customer: 'Jane Doe',
      amount: 1620,
      status: 'completed',
      method: 'credit_card',
      type: 'payment',
      date: '2024-12-10',
      invoiceId: '2',
      description: 'Payment for INV-002'
    },
    {
      id: '2',
      customer: 'Mike Johnson',
      amount: 750,
      status: 'pending',
      method: 'bank_transfer',
      type: 'payment',
      date: '2024-12-18',
      description: 'Consultation fee'
    }
  ],
  paymentMethods: [
    {
      id: '1',
      type: 'stripe',
      name: 'Stripe',
      isActive: true,
      settings: {
        publishableKey: 'pk_test_...',
        webhookSecret: 'whsec_...'
      }
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      isActive: false,
      settings: {
        clientId: 'paypal_client_id',
        clientSecret: 'paypal_client_secret'
      }
    }
  ],
  searchQuery: '',
  statusFilter: 'all',
  selectedInvoice: null,
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: state.generateInvoiceNumber(),
      createdDate: new Date()
    }]
  })),
  updateInvoice: (id, updates) => set((state) => ({
    invoices: state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, ...updates } : invoice
    )
  })),
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(invoice => invoice.id !== id)
  })),
  duplicateInvoice: (id) => set((state) => {
    const invoice = state.invoices.find(inv => inv.id === id);
    if (!invoice) return state;
    
    return {
      invoices: [...state.invoices, {
        ...invoice,
        id: Date.now().toString(),
        invoiceNumber: state.generateInvoiceNumber(),
        status: 'draft' as const,
        createdDate: new Date(),
        paidDate: undefined
      }]
    };
  }),
  sendInvoice: (id) => set((state) => ({
    invoices: state.invoices.map(invoice =>
      invoice.id === id ? { ...invoice, status: 'sent' as const } : invoice
    )
  })),
  markInvoicePaid: (id) => set((state) => ({
    invoices: state.invoices.map(invoice =>
      invoice.id === id ? { 
        ...invoice, 
        status: 'paid' as const, 
        paidDate: new Date() 
      } : invoice
    )
  })),
  addTransaction: (transaction) => set((state) => ({
    transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
  })),
  addPaymentMethod: (method) => set((state) => ({
    paymentMethods: [...state.paymentMethods, { ...method, id: Date.now().toString() }]
  })),
  updatePaymentMethod: (id, updates) => set((state) => ({
    paymentMethods: state.paymentMethods.map(method =>
      method.id === id ? { ...method, ...updates } : method
    )
  })),
  deletePaymentMethod: (id) => set((state) => ({
    paymentMethods: state.paymentMethods.filter(method => method.id !== id)
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
  generateInvoiceNumber: () => {
    const { invoices } = get();
    const lastInvoice = invoices.sort((a, b) => 
      parseInt(a.invoiceNumber.split('-')[1]) - parseInt(b.invoiceNumber.split('-')[1])
    ).pop();
    
    if (!lastInvoice) return 'INV-001';
    
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1]);
    return `INV-${String(lastNumber + 1).padStart(3, '0')}`;
  }
}));
