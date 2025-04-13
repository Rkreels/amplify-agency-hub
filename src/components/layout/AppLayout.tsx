
import { MainNav } from "./MainNav";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <div className="hidden md:block w-64 bg-[#1A1F2C] text-white">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col">
          <MainNav />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
