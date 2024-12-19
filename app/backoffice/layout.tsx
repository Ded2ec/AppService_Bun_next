import TopNav from "../components/top-nav";
import { Sidebar } from "../components/sidebar";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />

      <div className="bg-gray-880">
        <Sidebar />
        <main className="flex-1 p-6 bg-gradient-to-t from-gray-600 to-gray-950 rounded-tl-3xl">
            {children}
        </main>
      </div>
    </div>
  );
}