
import React from 'react';
import { ComprehensivePageBuilder } from './ComprehensivePageBuilder';

interface EnhancedPageBuilderProps {
  siteId: string;
}

export function EnhancedPageBuilder({ siteId }: EnhancedPageBuilderProps) {
  return <ComprehensivePageBuilder siteId={siteId} />;
}
