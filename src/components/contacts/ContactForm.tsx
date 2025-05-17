
import { useState, useEffect } from "react";
import { useContactsStore, type Contact, type ContactStatus } from "@/store/useContactsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface ContactFormProps {
  contact?: Contact;
  onComplete: () => void;
}

export function ContactForm({ contact, onComplete }: ContactFormProps) {
  const { addContact, updateContact } = useContactsStore();
  
  // Form state
  const [firstName, setFirstName] = useState(contact?.firstName || "");
  const [lastName, setLastName] = useState(contact?.lastName || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [company, setCompany] = useState(contact?.company || "");
  const [status, setStatus] = useState<ContactStatus>(contact?.status || "lead");
  const [notes, setNotes] = useState(contact?.notes || "");
  const [source, setSource] = useState(contact?.source || "");
  const [street, setStreet] = useState(contact?.address?.street || "");
  const [city, setCity] = useState(contact?.address?.city || "");
  const [state, setState] = useState(contact?.address?.state || "");
  const [zipCode, setZipCode] = useState(contact?.address?.zipCode || "");
  const [country, setCountry] = useState(contact?.address?.country || "");
  
  const isEditing = !!contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const contactData = {
      firstName,
      lastName,
      email,
      phone,
      status,
      company: company || undefined,
      tags: contact?.tags || [],
      notes,
      source: source || undefined,
      address: {
        street,
        city,
        state,
        zipCode,
        country,
      },
    };
    
    if (isEditing && contact) {
      updateContact(contact.id, contactData);
      toast.success("Contact updated successfully");
    } else {
      addContact(contactData);
      toast.success("Contact added successfully");
    }
    
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            value={company} 
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: ContactStatus) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any relevant notes about this contact"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="source">Lead Source</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Call">Phone Call</SelectItem>
            <SelectItem value="Event">Event</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Address Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input 
              id="street" 
              value={street} 
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                placeholder="Springfield"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                placeholder="IL"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input 
                id="zipCode" 
                value={zipCode} 
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="62704"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Save Changes" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
}
