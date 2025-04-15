
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet,
  X,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Device {
  id: string;
  type: "mobile" | "tablet" | "desktop" | "laptop";
  browser: string;
  os: string;
  lastActive: string;
  location: string;
  ipAddress: string;
  isCurrentDevice: boolean;
}

export default function DeviceSettings({ onChange }: { onChange?: () => void }) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "dev_1",
      type: "laptop",
      browser: "Chrome 114",
      os: "Windows 11",
      lastActive: "Now",
      location: "Eugene, Oregon",
      ipAddress: "192.168.1.1",
      isCurrentDevice: true,
    },
    {
      id: "dev_2",
      type: "mobile",
      browser: "Safari 16",
      os: "iOS 17",
      lastActive: "2 days ago",
      location: "Portland, Oregon",
      ipAddress: "192.168.1.2",
      isCurrentDevice: false,
    },
    {
      id: "dev_3",
      type: "desktop",
      browser: "Firefox 112",
      os: "macOS 14",
      lastActive: "1 week ago",
      location: "Seattle, Washington",
      ipAddress: "192.168.1.3",
      isCurrentDevice: false,
    }
  ]);
  
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "laptop":
        return <Laptop className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const handleRevokeAccess = (deviceId: string) => {
    if (devices.find(device => device.id === deviceId)?.isCurrentDevice) {
      toast.error("You cannot revoke access for your current device");
      return;
    }
    
    setSelectedDevice(deviceId);
    setShowRevokeDialog(true);
  };
  
  const confirmRevoke = () => {
    if (!selectedDevice) return;
    
    setDevices(devices.filter(device => device.id !== selectedDevice));
    toast.success("Device access revoked successfully");
    setShowRevokeDialog(false);
    
    if (onChange) onChange();
  };
  
  const handleLogoutAllDevices = () => {
    setShowLogoutAllDialog(true);
  };
  
  const confirmLogoutAll = () => {
    const currentDevice = devices.find(device => device.isCurrentDevice);
    
    if (currentDevice) {
      setDevices([currentDevice]);
      toast.success("All other devices have been logged out");
    }
    
    setShowLogoutAllDialog(false);
    if (onChange) onChange();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Device Management</CardTitle>
            <CardDescription>
              Manage devices that are currently logged in to your account
            </CardDescription>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleLogoutAllDevices}
            disabled={devices.length <= 1}
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Logout All Other Devices
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {device.os}
                          {device.isCurrentDevice && (
                            <Badge variant="outline" className="bg-primary/10 text-primary ml-1">Current</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {device.browser}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{device.location}</div>
                      <div className="text-sm text-muted-foreground">{device.ipAddress}</div>
                    </div>
                  </TableCell>
                  <TableCell>{device.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeAccess(device.id)}
                      disabled={device.isCurrentDevice}
                      className={device.isCurrentDevice ? "opacity-50" : "text-destructive hover:text-destructive/90 hover:bg-destructive/10"}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Device Access</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately log out this device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevoke} className="bg-destructive text-destructive-foreground">
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showLogoutAllDialog} onOpenChange={setShowLogoutAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout All Other Devices</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately log out all devices except your current one. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogoutAll} className="bg-destructive text-destructive-foreground">
              Logout All Devices
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
