
import { AppLayout } from '@/components/layout/AppLayout';
import { GHLStyleWorkflowBuilder } from '@/components/automation/workflow/GHLStyleWorkflowBuilder';
import { ReactFlowProvider } from '@xyflow/react';

export default function AutomationBuilder() {
  return (
    <AppLayout>
      <ReactFlowProvider>
        <GHLStyleWorkflowBuilder />
      </ReactFlowProvider>
    </AppLayout>
  );
}
