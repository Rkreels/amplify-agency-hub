
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Globe, 
  Zap, 
  BarChart3, 
  Settings,
  Folder,
  FileText,
  Image,
  Video,
  FormInput
} from 'lucide-react';

interface SitesLeftSidebarProps {
  onCreateSite: () => void;
}

export function SitesLeftSidebar({ onCreateSite }: SitesLeftSidebarProps) {
  const quickActions = [
    { name: 'Create Site', icon: Plus, action: onCreateSite },
    { name: 'Import Template', icon: FileText, action: () => {} },
    { name: 'Analytics', icon: BarChart3, action: () => {} },
    { name: 'Settings', icon: Settings, action: () => {} }
  ];

  const categories = [
    { name: 'All Sites', count: 12, icon: Globe },
    { name: 'Published', count: 8, icon: Zap },
    { name: 'Drafts', count: 4, icon: FileText },
    { name: 'Templates', count: 25, icon: Folder }
  ];

  const recentAssets = [
    { name: 'Hero Image', type: 'image', icon: Image },
    { name: 'Product Video', type: 'video', icon: Video },
    { name: 'Contact Form', type: 'form', icon: FormInput }
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Sites & Funnels</h2>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.name}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Categories */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                size="sm"
                className="w-full justify-between"
              >
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Assets */}
        <div className="p-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Assets</h3>
          <div className="space-y-2">
            {recentAssets.map((asset) => (
              <div
                key={asset.name}
                className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <asset.icon className="h-4 w-4 mr-2 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{asset.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
