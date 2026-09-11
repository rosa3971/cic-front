import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, login, STORAGE_KEY} from "../../api/auth.api.ts";
import {userAtom} from "../../store/auth.ts";
import {useSetAtom} from "jotai";

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const setUser = useSetAtom(userAtom);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!username || !password) {
            setError("아이디과 비밀번호를 입력해주세요.");
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const { token } = await login(username, password);
            localStorage.setItem(STORAGE_KEY, token);

            const user = getUserFromToken();
            setUser(user);

            navigate("/", { replace: true });

        } catch (err: any) {
            setError(err.message || "로그인 실패");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <h1 className="text-3xl font-cic font-light mb-10 uppercase">
                Studio Login
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">

                {/* 이메일 */}
                <div className="space-y-2">
                    <label className="block text-sm text-zinc-500">
                        이메일
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="username"
                        className="w-full px-3 py-2 border border-zinc-300"
                    />
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                    <label className="block text-sm text-zinc-500">
                        비밀번호
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full px-3 py-2 border border-zinc-300"
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-zinc-800 text-white"
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
        </div>
    );
}