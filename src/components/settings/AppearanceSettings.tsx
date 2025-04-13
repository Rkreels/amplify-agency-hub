
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Type, 
  Layout, 
  Laptop, 
  CheckCircle2,
  EyeOff,
  X
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppearanceSettingsProps {
  onChange: () => void;
}

export default function AppearanceSettings({ onChange }: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>Customize the look and feel of your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Theme</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="border rounded-md p-4 cursor-pointer relative hover:border-primary"
              onClick={onChange}
            >
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="mb-3">
                <div className="w-full h-24 bg-[#1A1F2C] rounded-md mb-2 flex items-center justify-center">
                  <div className="w-3/4 h-4 bg-white/20 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-full h-10 bg-[#1A1F2C] rounded-md" />
                  <div className="w-full h-10 bg-[#1A1F2C] rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Moon className="h-4 w-4" />
                <span className="font-medium">Dark</span>
              </div>
            </div>
            
            <div 
              className="border rounded-md p-4 cursor-pointer relative hover:border-primary"
              onClick={onChange}
            >
              <div className="mb-3">
                <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  <div className="w-3/4 h-4 bg-gray-300 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-full h-10 bg-gray-100 rounded-md" />
                  <div className="w-full h-10 bg-gray-100 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Sun className="h-4 w-4" />
                <span className="font-medium">Light</span>
              </div>
            </div>
            
            <div 
              className="border rounded-md p-4 cursor-pointer relative hover:border-primary"
              onClick={onChange}
            >
              <div className="mb-3">
                <div className="w-full h-24 bg-gradient-to-b from-gray-100 to-[#1A1F2C] rounded-md mb-2 flex items-center justify-center">
                  <div className="w-3/4 h-4 bg-gray-300/50 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-full h-10 bg-gradient-to-r from-gray-100 to-[#1A1F2C] rounded-md" />
                  <div className="w-full h-10 bg-gradient-to-r from-gray-100 to-[#1A1F2C] rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Monitor className="h-4 w-4" />
                <span className="font-medium">System</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Font & Display</h3>
          </div>
          
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="compact">Display Density</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm">A</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    defaultValue="3" 
                    className="flex-1"
                    onChange={onChange}
                  />
                  <span className="text-lg">A</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Font Family</Label>
                <select 
                  className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                  onChange={onChange}
                >
                  <option>System Default</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                  <option>Montserrat</option>
                </select>
              </div>
            </TabsContent>
            <TabsContent value="compact" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Display Density</Label>
                <RadioGroup defaultValue="comfortable" className="flex flex-col space-y-2" onValueChange={onChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="compact" />
                    <Label htmlFor="compact">Compact - Show more content with less whitespace</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="comfortable" />
                    <Label htmlFor="comfortable">Comfortable - Balanced whitespace and content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spacious" id="spacious" />
                    <Label htmlFor="spacious">Spacious - More whitespace between elements</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Layout Preferences</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Sidebar Navigation</Label>
                <p className="text-sm text-muted-foreground">
                  Show sidebar navigation on the left side
                </p>
              </div>
              <Switch defaultChecked onChange={onChange} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Sidebar Collapse</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sidebar to be collapsed to icons only
                </p>
              </div>
              <Switch defaultChecked onChange={onChange} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Show Welcome Screen</Label>
                <p className="text-sm text-muted-foreground">
                  Display welcome screen when logging in
                </p>
              </div>
              <Switch onChange={onChange} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Show Feature Announcements</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new features and updates
                </p>
              </div>
              <Switch defaultChecked onChange={onChange} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onChange}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
