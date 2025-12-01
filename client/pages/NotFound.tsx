import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between min-w-0">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground truncate">QOS Insights</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            홈으로
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          </Link>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="text-center max-w-full min-w-0">
          <div className="mb-6 sm:mb-8">
            <div className="text-6xl sm:text-8xl font-bold text-primary/20 mb-4 break-words">404</div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 break-words px-4">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto break-words px-4">
              요청하신 페이지가 존재하지 않습니다. 홈페이지로 돌아가거나 대시보드를
              확인해보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              홈으로 돌아가기
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-border rounded-lg text-foreground hover:bg-secondary/30 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
            >
              대시보드 열기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
