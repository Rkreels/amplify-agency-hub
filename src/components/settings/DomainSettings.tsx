
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Plus, CheckCircle2, XCircle, ArrowRight, AlertCircle, ExternalLink, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DomainSettingsProps {
  onChange: () => void;
}

export default function DomainSettings({ onChange }: DomainSettingsProps) {
  const [domains, setDomains] = useState([
    {
      id: 1,
      domain: "app.youragency.com",
      type: "Primary",
      status: "verified",
      addedOn: "Jan 15, 2025"
    },
    {
      id: 2,
      domain: "booking.youragency.com",
      type: "Subdomain",
      status: "verified",
      addedOn: "Feb 3, 2025"
    },
    {
      id: 3,
      domain: "clients.youragency.com",
      type: "Subdomain",
      status: "unverified",
      addedOn: "Apr 10, 2025"
    }
  ]);
  
  const [newDomain, setNewDomain] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [domainToRemove, setDomainToRemove] = useState<number | null>(null);

  const addDomain = () => {
    if (!newDomain) {
      toast.error("Please enter a domain name");
      return;
    }
    
    if (domains.some(d => d.domain === newDomain)) {
      toast.error("This domain is already added");
      return;
    }
    
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const newDomainObj = {
      id: Date.now(),
      domain: newDomain,
      type: "Subdomain",
      status: "unverified",
      addedOn: formattedDate
    };
    
    setDomains([...domains, newDomainObj]);
    setNewDomain("");
    setOpenDialog(false);
    toast.success("Domain added. Please verify it.");
    onChange();
  };
  
  const verifyDomain = (id: number) => {
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setDomains(domains.map(d => 
        d.id === id ? { ...d, status: "verified" } : d
      ));
      setIsVerifying(false);
      toast.success("Domain verified successfully!");
      onChange();
    }, 2000);
  };
  
  const removeDomain = (id: number) => {
    setDomains(domains.filter(d => d.id !== id));
    setDomainToRemove(null);
    toast.success("Domain removed successfully!");
    onChange();
  };
  
  const visitDomain = (domain: string) => {
    window.open(`https://${domain}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Custom Domains</CardTitle>
            <CardDescription>Manage your custom domains and SSL certificates</CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {}}>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Domain</DialogTitle>
                <DialogDescription>
                  Enter a domain you own. You'll need to verify ownership.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain-input">Domain Name</Label>
                  <Input 
                    id="domain-input" 
                    placeholder="example.com" 
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={addDomain}>Add Domain</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{domain.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={domain.type === "Primary" ? "default" : "outline"}>
                      {domain.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {domain.status === "verified" ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>Unverified</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{domain.addedOn}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => visitDomain(domain.domain)}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </Button>
                      {domain.status === "unverified" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => verifyDomain(domain.id)}
                          disabled={isVerifying}
                        >
                          {isVerifying ? "Verifying..." : "Verify"}
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => setDomainToRemove(domain.id)}
                              disabled={domain.type === "Primary"}
                            >
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove the domain
                                "{domain.domain}" from your account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => removeDomain(domain.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Remove Domain
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Domain</CardTitle>
          <CardDescription>Connect a custom domain to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <div className="flex gap-2">
                <Input 
                  id="domain" 
                  placeholder="example.com" 
                  className="flex-1" 
                  value={newDomain}
                  onChange={(e) => {
                    setNewDomain(e.target.value);
                    onChange();
                  }}
                />
                <Button onClick={addDomain}>Verify Domain</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a domain you own. You'll need to verify ownership by updating DNS settings.
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Verification Instructions</h3>
              <div className="bg-muted/50 rounded-md p-4 space-y-3">
                <div>
                  <p className="font-medium">1. Add a CNAME record to your DNS settings</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-background p-2 rounded border">
                      <p className="text-muted-foreground">Host / Name</p>
                      <p className="font-mono">@</p>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <p className="text-muted-foreground">Value / Target</p>
                      <p className="font-mono">verify.youragency.highapp.com</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium">2. Add a TXT record to verify domain ownership</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-background p-2 rounded border">
                      <p className="text-muted-foreground">Host / Name</p>
                      <p className="font-mono">_verification</p>
                    </div>
                    <div className="bg-background p-2 rounded border">
                      <p className="text-muted-foreground">Value / Content</p>
                      <p className="font-mono">ghl-verification=xxxxxxxxxx</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>DNS changes may take up to 48 hours to propagate fully.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
