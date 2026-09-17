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
        {key: "Works", label: "Works", path:"/works"},
        { key: "About", label: "About", path: "/about" },
        { key: "Contact", label: "Contact", path: "/contact" },
    ];

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

export default function Header({ onClose }: HeaderProps) {
    const auth = useAtomValue(userAtom);
    const setUser = useSetAtom(userAtom);
    const menus = useMemo(() => buildMenus(auth), [auth]);
    const [hovered, setHovered] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const routeMainKey = useMemo(() => {
        const path = location.pathname;
        if (path.startsWith("/Works")) return "Works";
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
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-4">
            {/* 왼쪽: 인스타그램 아이콘 */}
            <div className="flex justify-start">
                <a href="https://www.instagram.com/cic_studio_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:opacity-70 transition-opacity"
                aria-label="Instagram"
                >
                <InstagramIcon />
            </a>
        </div>


            {/* 가운데: CIC Studio 텍스트 로고 - 내용 크기만큼만 차지 */}
            <div className="flex justify-center">
                <p
                    className="font-cic tracking-tight text-xl lg:text-4xl text-black cursor-pointer leading-none font-regular whitespace-nowrap"
                    onClick={() => handleNavigate("/")}
                >
                    CIC Studio
                </p>
            </div>


            {/* 오른쪽: 메뉴 - 넘치면 가로 스크롤 */}
            <nav
                className="flex items-center justify-end gap-4 lg:gap-8"
                onMouseLeave={() => setHovered(null)}
            >
                {menus.map((menu) => {
                    return (
                        <div
                            key={menu.key}
                            className="relative flex flex-col items-center flex-shrink-0"
                            onMouseEnter={() => setHovered(menu.key)}
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
                                className="font-cic font-regular tracking-tight text-base lg:text-4xl text-black hover:opacity-70 transition-opacity duration-300 whitespace-nowrap"
                            >
                                {menu.label}
                            </button>

                            {menu.sub && hovered === menu.key && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                                    <ul className="flex flex-col items-center gap-2 whitespace-nowrap">
                                        {menu.sub.map((item) => (
                                            <li
                                                key={item.path}
                                                className="font-cic font-regular cursor-pointer text-black/70 hover:text-black transition-colors text-sm"
                                                onClick={() => handleNavigate(item.path)}
                                            >
                                                {item.label}
                                            </li>
                                        ))}
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

function InstagramIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}