
import { useState } from "react";
import { useSitesStore } from "@/store/useSitesStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface PageFormProps {
  siteId: string;
  pageId?: string;
  onComplete: () => void;
}

export function PageForm({ siteId, pageId, onComplete }: PageFormProps) {
  const { sites, addPage, updatePage } = useSitesStore();
  
  // Find the site and page if editing
  const site = sites.find(s => s.id === siteId);
  const page = pageId && site ? site.pages.find(p => p.id === pageId) : undefined;
  
  // Form state
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [isPublished, setIsPublished] = useState(page?.isPublished || false);
  
  const isEditing = !!page;
  
  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if it's a new page or slug hasn't been manually edited
    if (!isEditing || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !slug) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Clean up slug
    const cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug;
    
    const pageData = {
      title,
      slug: cleanSlug,
      isPublished,
    };
    
    if (isEditing && pageId) {
      updatePage(siteId, pageId, pageData);
      toast.success("Page updated successfully");
    } else {
      addPage(siteId, pageData);
      toast.success("Page added successfully");
    }
    
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Page Title *</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={handleTitleChange}
          placeholder="Home Page"
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug *</Label>
        <div className="flex items-center">
          <div className="bg-muted p-2 rounded-l-md border border-r-0 border-input">
            /
          </div>
          <Input 
            id="slug" 
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="home"
            className="rounded-l-none"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          The URL path for this page (e.g. "about" for yoursite.com/about)
        </p>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
        <Label htmlFor="published">Publish this page</Label>
      </div>
      
      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Page" : "Add Page"}
        </Button>
      </div>
    </form>
  );
}
