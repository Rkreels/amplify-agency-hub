
import { useState } from "react";
import { useSitesStore, type SitePage } from "@/store/useSitesStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteForm } from "@/components/sites/SiteForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageForm } from "@/components/sites/PageForm";
import { format } from "date-fns";
import { Globe, Calendar, Users, ArrowUpRight, Edit, Settings, Trash2, Plus, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface SiteDetailsProps {
  onClose: () => void;
}

export function SiteDetails({ onClose }: SiteDetailsProps) {
  const { selectedSite, deleteSite, updateSite, publishSite, unpublishSite, addPage, deletePage } = useSitesStore();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Safety check
  if (!selectedSite) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No site selected</p>
        <Button className="mt-4" onClick={onClose}>Close</Button>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteSite(selectedSite.id);
    toast.success("Site deleted successfully");
    onClose();
  };
  
  const handleToggleStatus = () => {
    if (selectedSite.status === 'published') {
      unpublishSite(selectedSite.id);
      toast.success("Site unpublished");
    } else {
      publishSite(selectedSite.id);
      toast.success("Site published successfully");
    }
  };
  
  const handleDeletePage = (pageId: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      deletePage(selectedSite.id, pageId);
      toast.success("Page deleted successfully");
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-primary/10 rounded-md">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{selectedSite.name}</h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <a href={`https://${selectedSite.url}`} target="_blank" rel="noreferrer" className="flex items-center hover:underline">
                {selectedSite.url}
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={selectedSite.status === 'published' ? 'outline' : 'default'} onClick={handleToggleStatus}>
            {selectedSite.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-md p-4 flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{format(new Date(selectedSite.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-md p-4 flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="font-medium">{selectedSite.pages.length}</p>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-md p-4 flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="font-medium">{selectedSite.visitors.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Site Details</h3>
            <div className="bg-muted/30 rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={selectedSite.status === 'published' ? 'default' : 'outline'}>
                  {selectedSite.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{selectedSite.type}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{format(new Date(selectedSite.lastUpdated), 'MMM d, yyyy')}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain</span>
                <a 
                  href={`https://${selectedSite.url}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {selectedSite.url}
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </div>
              {selectedSite.description && (
                <>
                  <Separator />
                  <div>
                    <span className="text-muted-foreground">Description</span>
                    <p className="mt-1">{selectedSite.description}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pages">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Pages</h3>
              <Button onClick={() => setShowAddPageDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>URL Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSite.pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="text-muted-foreground">
                          No pages yet. Add your first page to get started.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedSite.pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>/{page.slug}</TableCell>
                        <TableCell>
                          <Badge variant={page.isPublished ? 'default' : 'outline'}>
                            {page.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => toast.success("Edit page")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePage(page.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Site Settings</h3>
              <div className="bg-muted/30 rounded-md p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={selectedSite.name}
                    onChange={(e) => updateSite(selectedSite.id, { name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Domain</Label>
                  <Input 
                    id="siteUrl" 
                    value={selectedSite.url}
                    onChange={(e) => updateSite(selectedSite.id, { url: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Danger Zone</h3>
              <div className="border border-destructive/20 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Delete this site</h4>
                    <p className="text-sm text-muted-foreground">
                      Once deleted, it cannot be recovered.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    Delete Site
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
          </DialogHeader>
          <SiteForm 
            site={selectedSite} 
            onComplete={() => setShowEditDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Page Dialog */}
      <Dialog open={showAddPageDialog} onOpenChange={setShowAddPageDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <PageForm 
            siteId={selectedSite.id}
            onComplete={() => setShowAddPageDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Site</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedSite.name}? This action cannot be undone and will remove all pages and content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
