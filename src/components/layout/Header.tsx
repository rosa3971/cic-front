// src/components/layout/Header.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth.api.ts";
import { userAtom } from "../../store/auth.ts";
import { useAtomValue, useSetAtom } from "jotai";

type HeaderProps = {
    isHome: boolean;
    onClose?: () => void;
};

type SubMenu = {
    label: string;
    path: string;
};

type Menu = {
    key: "Works" | "News" | "Contact" | "About" | "Admin" | "Login" | "MyProject" | "Logout";
    label: string;
    sub?: SubMenu[];
    path?: string;
};

type AuthState = {
    role: string | null;
};

function buildMenus(auth: AuthState | null): Menu[] {
    const base: Menu[] = [
        {
            key: "Works",
            label: "Works",
            sub: [
                { label: "Interior", path: "/works/interior" },
                { label: "Furniture", path: "/works/furniture" },
            ],
        },
        { key: "Contact", label: "Contact", path: "/contact" },
        { key: "About", label: "About", path: "/about" },
        { key: "News", label: "News", path: "/news" },
    ];

    // 로그인 했으면 관리자 메뉴 추가
    if (auth?.role === "ROLE_ADMIN") {
        return [
            ...base,
            {
                key: "Admin",
                label: "Admin",
                sub: [
                    { label: "HomeImage", path: "/admin/HomeImage" },
                    { label: "ProjectList", path: "/admin/project/list" },
                    { label: "FurnitureList", path: "/admin/furniture/list" },
                    { label: "About", path: "/admin/about" },
                ],
            },
            { key: "Logout", label: "Logout", path: "/Login" },
        ];
    }
    return base;
}

export default function Header({ isHome, onClose }: HeaderProps) {
    const auth = useAtomValue(userAtom);
    const setUser = useSetAtom(userAtom);
    const menus = useMemo(() => buildMenus(auth), [auth]);
    const [hovered, setHovered] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const routeMainKey = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith("/Works")) return "Works";
        if (path.startsWith("/News")) return "News";
        if (path.startsWith("/Contact")) return "Contact";
        if (path.startsWith("/About")) return "About";
        if (path.startsWith("/Admin")) return "Admin";
        if (path.startsWith("/Login")) return "Login";
        return null;
    }, [location.pathname]);

    const currentMenuKey = hovered ?? routeMainKey;

    const handleNavigate = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <div className="flex items-start justify-between w-full select-none">
            {/* 왼쪽: 로고 */}
            <div className="flex justify-start">
                <img
                    src="/images/footer/footer.png"
                    className="w-[60px] h-auto lg:w-[80px] object-contain transition-all cursor-pointer"
                    onClick={() => handleNavigate("/")}
                    alt="Footer Logo"
                />
            </div>

            {/* 오른쪽: 메뉴 + 서브메뉴 */}
            <nav className="flex items-start gap-8 lg:gap-12">
                {menus.map((menu) => {
                    const isActive = currentMenuKey === menu.key;
                    const baseColor = isHome ? "text-black/60" : "text-zinc-400";
                    const activeColor = "text-black";

                    return (
                        <div
                            key={menu.key}
                            className="relative flex flex-col items-center"
                            onMouseEnter={() => setHovered(menu.key)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <button
                                onClick={async () => {
                                    if (menu.key === "Logout") {
                                        await logout();
                                        setUser({ role: null });
                                        handleNavigate("/");
                                        return;
                                    }
                                    if (menu.path) handleNavigate(menu.path);
                                }}
                                className={
                                    "font-cic font-bold tracking-tight text-lg lg:text-2xl transition-colors duration-300 " +
                                    (isActive ? activeColor : `${baseColor} hover:text-black`)
                                }
                            >
                                {menu.label}
                            </button>

                            {/* 서브 메뉴: 간격 없이 바로 이어지도록 padding으로 hover 영역 연결 */}
                            {menu.sub && hovered === menu.key && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                                    <ul className="flex flex-col items-center gap-2 whitespace-nowrap">
                                        {menu.sub.map((item) => {
                                            const isSubActive = location.pathname === item.path;
                                            return (
                                                <li
                                                    key={item.path}
                                                    className={
                                                        "font-cic font-regular cursor-pointer transition-colors text-sm lg:text-base " +
                                                        (isSubActive
                                                            ? "text-zinc-900 font-medium"
                                                            : "text-zinc-500 hover:text-zinc-900")
                                                    }
                                                    onClick={() => handleNavigate(item.path)}
                                                >
                                                    {item.label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}