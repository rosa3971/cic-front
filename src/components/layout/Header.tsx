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
        <div className="grid grid-cols-3 items-center w-full select-none">
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

    {/* 가운데: CIC Studio 텍스트 로고 */}
    <div className="flex justify-center">
        <p
            className="font-cic tracking-tight text-xl lg:text-3xl text-black cursor-pointer leading-none font-semibold"
            onClick={() => handleNavigate("/")}
        >
            CIC Studio
        </p>
    </div>

    {/* 오른쪽: 메뉴 - 항상 검정색 고정 */}
    <nav
        className="flex items-center justify-end gap-8 lg:gap-12"
        onMouseLeave={() => setHovered(null)}
    >
        {menus.map((menu) => {
            return (
                <div
                    key={menu.key}
                    className="relative flex flex-col items-center"
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
                        className="font-cic font-bold tracking-tight text-lg lg:text-3xl text-black hover:opacity-70 transition-opacity duration-300"
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
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}