
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  Users, 
  DollarSign,
  Calendar,
  Target
} from 'lucide-react';
import { useSubAccount } from '@/contexts/SubAccountContext';

export function SubAccountSwitcher() {
  const { currentSubAccount, subAccounts, switchSubAccount, currentUser } = useSubAccount();
  const [isOpen, setIsOpen] = useState(false);

  const accessibleAccounts = subAccounts.filter(account => 
    currentUser?.accessibleAccounts.includes(account.id)
  );

  const handleAccountSwitch = (accountId: string) => {
    switchSubAccount(accountId);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-auto p-3 bg-white hover:bg-gray-50 border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentSubAccount?.logo} />
              <AvatarFallback className="bg-blue-100">
                <Building2 className="h-4 w-4 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium text-sm text-gray-900">
                {currentSubAccount?.name || 'Select Account'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {currentSubAccount?.type} Account
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-white border border-gray-200 shadow-lg" align="start">
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Switch Account</span>
            <Badge variant="secondary" className="text-xs bg-gray-100">
              {accessibleAccounts.length} Available
            </Badge>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {accessibleAccounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="p-3 cursor-pointer focus:bg-blue-50 hover:bg-gray-50"
            onClick={() => handleAccountSwitch(account.id)}
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={account.logo} />
                <AvatarFallback className="bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{account.name}</span>
                  {currentSubAccount?.id === account.id && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Badge 
                    variant={account.type === 'agency' ? 'default' : 'secondary'} 
                    className="text-xs px-2 py-0"
                  >
                    {account.type}
                  </Badge>
                  <span>•</span>
                  <span>{account.settings.timezone}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">{account.stats.contacts}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-500" />
                    <span className="text-gray-600">${Math.round(account.stats.revenue / 1000)}K</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-600">{account.stats.campaigns}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-orange-500" />
                    <span className="text-gray-600">{account.stats.appointments}</span>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="text-center text-sm text-gray-500 cursor-default justify-center">
          Contact your admin to access more accounts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
