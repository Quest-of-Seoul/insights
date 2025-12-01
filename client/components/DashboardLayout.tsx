import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Home,
  MapPin,
  Calendar,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart3, label: "개요", path: "/dashboard" },
    { icon: MapPin, label: "지자체별 통계", path: "/dashboard/district" },
    { icon: TrendingUp, label: "퀘스트별 통계", path: "/dashboard/quest" },
    { icon: Calendar, label: "시간대별 통계", path: "/dashboard/time" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground truncate">QOS Insights</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border/50 transition-transform duration-300 z-30 lg:translate-x-0 flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-2 h-16 px-6 border-b border-sidebar-border/50 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/60 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground truncate">
              QOS Insights
            </span>
          </div>

          {/* Mobile Padding */}
          <div className="h-4 lg:hidden flex-shrink-0" />

          {/* Navigation */}
          <nav className="space-y-2 px-4 flex-1 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Link */}
          <div className="p-4 border-t border-sidebar-border/50 flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors font-medium text-sm"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
