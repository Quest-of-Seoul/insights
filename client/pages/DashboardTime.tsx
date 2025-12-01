import DashboardLayout from "@/components/DashboardLayout";
import { Clock, Users, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

interface TimeStat {
  time_unit: string;
  time_value: string;
  visitor_count: number;
  visit_count: number;
}

export default function DashboardTime() {
  const [stats, setStats] = useState<TimeStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeUnit, setTimeUnit] = useState<"hour" | "day" | "week">("day");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/analytics/location-stats/time?unit=${timeUnit}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setStats(Array.isArray(data) ? data : data.stats || []);
      } catch (error) {
        console.error("Error fetching time stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeUnit]);

  const totalVisitors = stats.reduce((sum, d) => sum + (d.visitor_count || 0), 0);
  const totalVisits = stats.reduce((sum, d) => sum + (d.visit_count || 0), 0);
  const avgVisitsPerPeriod = stats.length > 0 ? (totalVisits / stats.length).toFixed(1) : "0";

  const getTimeLabel = () => {
    switch (timeUnit) {
      case "hour":
        return "시간";
      case "day":
        return "날짜";
      case "week":
        return "주";
      default:
        return "시간대";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 max-w-full">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
            시간대별 통계
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground break-words">
            시간, 날짜, 주 단위의 방문자 및 방문 패턴 분석
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {(["hour", "day", "week"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setTimeUnit(unit);
                  setLoading(true);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  timeUnit === unit
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-secondary/30"
                }`}
              >
                {unit === "hour"
                  ? "시간별"
                  : unit === "day"
                    ? "날짜별"
                    : "주별"}
              </button>
            ))}
          </div>
        </div>

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
              <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">전체 방문 횟수</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{totalVisits}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {getTimeLabel()}당 평균 방문
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground break-words">{avgVisitsPerPeriod}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 break-words">
            방문 트렌드
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-2">
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
          ) : stats.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                아직 수집된 데이터가 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4 min-w-0">
              {stats.map((stat, idx) => {
                const maxVisits = Math.max(...stats.map((s) => s.visit_count || 0));
                const barWidth = maxVisits > 0 ? (stat.visit_count || 0) / maxVisits : 0;

                return (
                  <div key={idx} className="min-w-0">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate min-w-0 flex-1" title={stat.time_value}>
                        {stat.time_value}
                      </span>
                      <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                        <span className="whitespace-nowrap">{stat.visitor_count || 0} 방문자</span>
                        <span className="font-semibold text-foreground whitespace-nowrap">
                          {stat.visit_count || 0} 회
                        </span>
                      </div>
                    </div>
                    <div className="h-6 sm:h-8 bg-secondary/30 rounded-lg overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
                        style={{ width: `${barWidth * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/20">
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      {getTimeLabel()}
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      방문자 수
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      방문 횟수
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-foreground whitespace-nowrap">
                      평균 방문/방문자
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
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
                  ) : stats.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <p className="text-muted-foreground">
                          아직 수집된 데이터가 없습니다.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    stats.map((stat, idx) => {
                      const avgPerVisitor =
                        (stat.visitor_count || 0) > 0
                          ? ((stat.visit_count || 0) / (stat.visitor_count || 1)).toFixed(
                              2
                            )
                          : "0";

                      return (
                        <tr
                          key={idx}
                          className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-4 text-foreground font-medium min-w-[120px]">
                            <span className="block truncate max-w-[200px]" title={stat.time_value}>
                              {stat.time_value}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                            {stat.visitor_count || 0}명
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-foreground whitespace-nowrap">
                            {stat.visit_count || 0}회
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {avgPerVisitor}회
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 border border-border rounded-xl p-4 sm:p-6 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 break-words">
            통계 설명
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">시간별 분석</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                하루 24시간 단위로 언제 가장 많은 사용자가 위치를 공유하는지 분석합니다.
                피크 시간대를 파악할 수 있습니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">날짜별 분석</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                일자별 방문 패턴을 분석합니다. 주말/평일의 차이나 특정 기간의 트렌드를
                파악할 수 있습니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">주별 분석</h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                주 단위의 광범위한 트렌드를 분석합니다. 장기적인 이용 패턴을 파악하는 데
                유용합니다.
              </p>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground mb-2 break-words">
                평균 방문/방문자
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                각 기간당 평균적으로 한 사용자가 몇 번 위치를 공유했는지 나타냅니다. 높을수록
                재방문 사용자가 많습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
