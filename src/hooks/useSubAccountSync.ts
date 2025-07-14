
import { useEffect } from 'react';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useContactsStore } from '@/store/useContactsStore';
import { useConversationsStore } from '@/store/useConversationsStore';

export const useSubAccountSync = () => {
  const { currentSubAccount } = useSubAccount();
  const { loadSubAccountContacts } = useContactsStore();
  const { conversations, setSelectedConversation } = useConversationsStore();

  useEffect(() => {
    if (currentSubAccount) {
      // Load contacts for the current sub-account
      loadSubAccountContacts(currentSubAccount.id);
      
      // Clear selected conversation when switching accounts
      setSelectedConversation(null);
      
      // Load conversations for the current sub-account
      // This would typically filter conversations by sub-account
      console.log(`Loaded data for sub-account: ${currentSubAccount.name}`);
    }
  }, [currentSubAccount?.id, loadSubAccountContacts, setSelectedConversation]);

  // Listen for sub-account changes
  useEffect(() => {
    const handleSubAccountChange = (event: CustomEvent) => {
      const { accountId } = event.detail;
      loadSubAccountContacts(accountId);
    };

    window.addEventListener('subAccountChanged', handleSubAccountChange as EventListener);
    return () => {
      window.removeEventListener('subAccountChanged', handleSubAccountChange as EventListener);
    };
  }, [loadSubAccountContacts]);
};
