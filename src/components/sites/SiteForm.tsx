
import { useState } from "react";
import { useSitesStore, type Site, type SiteStatus, type SiteType } from "@/store/useSitesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Globe, Layout } from "lucide-react";

interface SiteFormProps {
  site?: Site;
  onComplete: () => void;
}

export function SiteForm({ site, onComplete }: SiteFormProps) {
  const { addSite, updateSite } = useSitesStore();
  
  // Form state
  const [name, setName] = useState(site?.name || "");
  const [url, setUrl] = useState(site?.url || "");
  const [description, setDescription] = useState(site?.description || "");
  const [type, setType] = useState<SiteType>(site?.type || "website");
  
  const isEditing = !!site;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !url) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Clean up URL if needed
    let cleanUrl = url;
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    }
    
    const siteData = {
      name,
      url: cleanUrl,
      description,
      type,
      status: 'draft' as SiteStatus,
      pages: [],
    };
    
    if (isEditing && site) {
      updateSite(site.id, siteData);
      toast.success("Site updated successfully");
    } else {
      addSite(siteData);
      toast.success("Site created successfully");
    }
    
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Site Name *</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Website"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">Domain/URL *</Label>
        <div className="flex items-center">
          <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input 
            id="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            placeholder="mysite.com"
            className="rounded-l-none"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your domain without http:// or https://
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Site Type</Label>
        <Select value={type} onValueChange={(value: SiteType) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select site type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="landing">Landing Page</SelectItem>
            <SelectItem value="funnel">Sales Funnel</SelectItem>
            <SelectItem value="booking">Booking Page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this site"
          rows={3}
        />
      </div>
      
      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Save Changes" : "Create Site"}
        </Button>
      </div>
    </form>
  );
}
