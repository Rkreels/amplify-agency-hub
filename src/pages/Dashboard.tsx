
import { AppLayout } from "@/components/layout/AppLayout";
import { WidgetManager } from "@/components/dashboard/widgets/WidgetManager";

export default function Dashboard() {
  return (
    <AppLayout>
      <WidgetManager />
    </AppLayout>
  );
}
