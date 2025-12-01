import DashboardLayout from "@/components/DashboardLayout";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { SEOUL_DISTRICTS_KR } from "@shared/constants";

interface QuestStat {
  quest_id: string;
  visitor_count: number;
  visit_count: number;
  district: string;
  average_distance: number;
}

export default function DashboardQuest() {
  const [stats, setStats] = useState<QuestStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/analytics/location-stats/quest");
        const data = await response.json();
        setStats(Array.isArray(data) ? data : data.stats || []);
      } catch (error) {
        console.error("Error fetching quest stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredStats = filterDistrict
    ? stats.filter((s) => s.district === filterDistrict)
    : stats;

  // API에서 받은 자치구와 서울 자치구 목록을 결합하여 정렬
  const apiDistricts = Array.from(new Set(stats.map((s) => s.district)));
  const allDistricts = Array.from(
    new Set([...SEOUL_DISTRICTS_KR, ...apiDistricts])
  ).sort();

  const totalVisitors = filteredStats.reduce(
    (sum, d) => sum + (d.visitor_count || 0),
    0
  );
  const totalVisits = filteredStats.reduce(
    (sum, d) => sum + (d.visit_count || 0),
    0
  );
  const avgDistance =
    filteredStats.length > 0
      ? (
        filteredStats.reduce((sum, d) => sum + (d.average_distance || 0), 0) /
        filteredStats.length
      ).toFixed(2)
      : "0.00";

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 max-w-full">
        {/* Header */}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
            퀘스트별 통계
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground break-words">
            개별 퀘스트의 방문자 수, 방문 횟수, 지역 분석
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-2 break-words">
              자치구 필터링
            </label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base min-w-0"
            >
              <option value="">모든 자치구</option>
              {allDistricts.map((district) => {
                const hasData = apiDistricts.includes(district);
                return (
                  <option key={district} value={district}>
                    {district}{hasData ? "" : " (데이터 없음)"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">전체 방문자 수</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{totalVisitors}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">전체 방문 횟수</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{totalVisits}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">평균 거리</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{avgDistance} km</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/20">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      퀘스트 ID
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      자치구
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      방문자 수
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      방문 횟수
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      평균 거리 (km)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : filteredStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-muted-foreground">
                          {filterDistrict
                            ? `${filterDistrict}의 퀘스트 데이터가 없습니다.`
                            : "아직 수집된 데이터가 없습니다."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStats.map((stat, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 text-foreground font-mono text-sm min-w-[120px]">
                          <span className="block truncate max-w-[200px]" title={stat.quest_id}>
                            {stat.quest_id}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-foreground min-w-[100px]">
                          <span className="block truncate max-w-[150px]" title={stat.district}>
                            {stat.district}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                          {stat.visitor_count || 0}명
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                          {stat.visit_count || 0}회
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                          {(stat.average_distance || 0).toFixed(2)} km
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-secondary/30 border border-border rounded-xl p-4 sm:p-6 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 break-words">
            통계 설명
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">퀘스트 ID</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                각 퀘스트의 고유 식별자입니다. 특정 퀘스트의 위치 데이터를 추적할 수
                있습니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">자치구</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                해당 퀘스트가 위치한 자치구입니다. 지역별 마케팅 전략 수립에
                활용됩니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">방문자 수</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                해당 퀘스트 위치에 방문한 익명화된 사용자의 순 인원입니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">방문 횟수</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                해당 퀘스트의 전체 방문 횟수입니다. 인기도를 측정하는 지표입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
