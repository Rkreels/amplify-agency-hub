
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Globe, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Trash2,
  Copy
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface DomainSettingsProps {
  onChange: (changes: any) => void;
  lastSaved?: number;
}

export default function DomainSettings({ onChange, lastSaved }: DomainSettingsProps) {
  const [newDomain, setNewDomain] = useState("");
  const [verifying, setVerifying] = useState<number | null>(null);
  const [domains, setDomains] = useState([
    { 
      id: 1, 
      domain: "youragency.com", 
      status: "verified", 
      type: "primary",
      addedAt: "2025-03-10" 
    },
    { 
      id: 2, 
      domain: "client.youragency.com", 
      status: "pending", 
      type: "booking",
      addedAt: "2025-04-01" 
    }
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddDomain = () => {
    // Basic domain validation
    if (!newDomain || !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(newDomain)) {
      toast.error("Please enter a valid domain name");
      return;
    }

    // Check for duplicate
    if (domains.some(d => d.domain === newDomain)) {
      toast.error("This domain is already added");
      return;
    }

    const newDomainObj = {
      id: domains.length + 1,
      domain: newDomain,
      status: "pending",
      type: "custom",
      addedAt: new Date().toISOString().split('T')[0]
    };

    setDomains([...domains, newDomainObj]);
    setNewDomain("");
    setShowAddDialog(false);
    onChange({ domains: [...domains, newDomainObj] });
    toast.success("Domain added successfully. Verification needed.");
  };

  const handleVerifyDomain = (id: number) => {
    setVerifying(id);
    
    // Simulate verification process
    setTimeout(() => {
      setDomains(domains.map(domain => 
        domain.id === id ? { ...domain, status: "verified" } : domain
      ));
      setVerifying(null);
      onChange({ domains: domains.map(domain => 
        domain.id === id ? { ...domain, status: "verified" } : domain
      )});
      toast.success("Domain verified successfully");
    }, 2000);
  };

  const handleDeleteDomain = (id: number) => {
    if (window.confirm("Are you sure you want to remove this domain?")) {
      const filteredDomains = domains.filter(domain => domain.id !== id);
      setDomains(filteredDomains);
      onChange({ domains: filteredDomains });
      toast.success("Domain removed successfully");
    }
  };

  const handleCopyDnsRecord = () => {
    navigator.clipboard.writeText("TXT agency-verify=123456789");
    toast.success("DNS record copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Domain Management</CardTitle>
            <CardDescription>
              Configure and manage custom domains for your agency
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Globe className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Domain</DialogTitle>
                <DialogDescription>
                  Enter the domain you'd like to connect to your account
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Make sure you own this domain before adding it. You'll need to verify ownership.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDomain}>Add Domain</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell>
                    {domain.status === "verified" ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending Verification
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {domain.type.charAt(0).toUpperCase() + domain.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{domain.addedAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      
                      {domain.status !== "verified" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleVerifyDomain(domain.id)}
                          disabled={verifying === domain.id}
                        >
                          {verifying === domain.id ? "Verifying..." : "Verify"}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteDomain(domain.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {domains.some(d => d.status === "pending") && (
            <div className="mt-6 border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Verify Domain Ownership</h3>
              <p className="text-sm text-muted-foreground mb-4">
                To verify domain ownership, add the following TXT record to your domain's DNS settings:
              </p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-md mb-3">
                <code className="text-xs">TXT agency-verify=123456789</code>
                <Button variant="ghost" size="sm" onClick={handleCopyDnsRecord}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                DNS changes may take up to 48 hours to propagate.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Configuration</CardTitle>
          <CardDescription>Configure DNS settings for your domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">DNS Records</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add these records to your domain's DNS settings to ensure proper functionality:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>TTL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>A</TableCell>
                    <TableCell>@</TableCell>
                    <TableCell>192.0.2.1</TableCell>
                    <TableCell>3600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CNAME</TableCell>
                    <TableCell>www</TableCell>
                    <TableCell>youragency.pages.dev</TableCell>
                    <TableCell>3600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CNAME</TableCell>
                    <TableCell>booking</TableCell>
                    <TableCell>youragency-booking.pages.dev</TableCell>
                    <TableCell>3600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MX</TableCell>
                    <TableCell>@</TableCell>
                    <TableCell>mail.youragency.com</TableCell>
                    <TableCell>3600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">SSL Certificates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                All domains automatically receive SSL certificates for secure HTTPS connections.
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Automated SSL provisioning enabled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
