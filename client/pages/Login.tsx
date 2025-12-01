import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "입력 오류",
                description: "이메일과 비밀번호를 모두 입력해주세요.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
            toast({
                title: "로그인 성공",
                description: "대시보드로 이동합니다.",
            });
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "로그인 실패",
                description: error instanceof Error ? error.message : "이메일 또는 비밀번호가 올바르지 않습니다.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-2xl text-foreground">QOS Insights</span>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                        관리자 로그인
                    </h1>
                    <p className="text-muted-foreground">
                        대시보드에 접속하려면 로그인해주세요
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                disabled={isLoading}
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    로그인 중...
                                </>
                            ) : (
                                "로그인"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            홈으로 돌아가기
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        문제가 있으신가요? 관리자에게 문의하세요.
                    </p>
                </div>
            </div>
        </div>
    );
}

