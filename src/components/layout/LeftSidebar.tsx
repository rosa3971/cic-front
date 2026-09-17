// src/components/layout/LeftSidebar.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout} from "../../api/auth.api.ts";
import {userAtom} from "../../store/auth.ts";
import {useAtomValue, useSetAtom} from "jotai";


type LeftSidebarProps = {
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
        {key: "Works", label: "Works", path: "/works"},
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

    export default function LeftSidebar({ isHome, onClose }: LeftSidebarProps) {
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
        const activeMenu = menus.find((m) => m.key === currentMenuKey);


        const handleNavigate = (path: string) => {
            navigate(path);
            if (onClose) onClose();
        };


        return (
            <div className="flex flex-col justify-between h-full select-none">
                <div className="">
                    {/* 로고: 해상도별 폰트 크기 최적화 */}
                    <div className="mb-6 lg:mb-8">
                        <p
                            className="font-cic tracking-tight text-lg lg:text-xl text-black cursor-pointer leading-none"
                            onClick={() => handleNavigate("/")}
                        >
                            CIC Studio
                        </p>
                    </div>

                    <div
                        className="flex pt-2"
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* 메인 메뉴: 고정 너비를 주어 서브메뉴 위치가 변하지 않게 함 */}
                        <nav className="space-y-1 lg:space-y-2 min-w-[90px] lg:min-w-[100px]">
                            {menus.map((menu) => {
                                const isActive = currentMenuKey === menu.key;
                                // 색상 대비를 명확히 하여 시인성 확보
                                const baseColor = isHome ? "text-black" : "text-zinc-400";
                                const activeColor = isHome ? "text-zinc-400" : "text-zinc-900";

                                return (
                                    <button
                                        key={menu.key}
                                        onMouseEnter={() => setHovered(menu.key)}
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
                                            "font-cic font-regular tracking-wide block text-left text-sm lg:text-md transition-all duration-300 " +
                                            (isActive ? activeColor : `${baseColor} hover:text-zinc-600`)
                                        }
                                    >
                                        {menu.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* 서브 메뉴: 메인 메뉴 옆에 배치 */}
                        <div
                            className="min-w-[100px] lg:min-w-[140px]"
                            onMouseEnter={() => !hovered && routeMainKey && setHovered(routeMainKey)}
                        >
                            {activeMenu?.sub && (
                                <ul className="space-y-1">
                                    {activeMenu.sub.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <li
                                                key={item.path}
                                                className={
                                                    "font-cic font-regular cursor-pointer transition-colors text-xs lg:text-base " +
                                                    (isActive ? "text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-800")
                                                }
                                                onClick={() => handleNavigate(item.path)}
                                            >
                                                {item.label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end lg:justify-start">
                    <img
                        src="/images/footer/footer.png"
                        className="w-[60px] h-auto lg:w-[80px] object-contain transition-all cursor-pointer"
                        onClick={() => handleNavigate("/")}
                        alt="Footer Logo"
                    />
                </div>
            </div>
        );
    }