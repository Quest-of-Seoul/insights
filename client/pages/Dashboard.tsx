import DashboardLayout from "@/components/DashboardLayout";
import { Users, Map, MapPin, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryStats {
  total_visitors: number;
  total_visits: number;
  total_quests: number;
  total_districts: number;
  average_distance: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics/location-stats/summary");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching summary stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 max-w-full">
        {/* Header */}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
            대시보드
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground break-words">
            익명화된 위치 데이터 수집 및 분석 현황
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="총 방문자 수"
            value={loading ? "-" : stats?.total_visitors || 0}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={MapPin}
            label="총 방문 횟수"
            value={loading ? "-" : stats?.total_visits || 0}
            color="from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={Map}
            label="총 퀘스트 수"
            value={loading ? "-" : stats?.total_quests || 0}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="총 자치구 수"
            value={loading ? "-" : stats?.total_districts || 0}
            color="from-orange-500 to-orange-600"
          />
        </div>

      </div>
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-border/80 transition-colors min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

