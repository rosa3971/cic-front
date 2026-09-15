// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";
import MobileHeader from "./MobileHeader";

export default function Layout({ isScrollable = true }) {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className={`w-full h-screen overflow-hidden ${isHome ? "" : "bg-white"}`}>
            {/* 모바일 헤더 */}
            <header className="md:hidden h-[60px] flex items-center">
                <MobileHeader isHome={isHome} />
            </header>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:flex md:flex-col w-full h-full">
                {/* 상단 헤더 */}
                <header className="flex-none w-full px-8 lg:px-12 pt-8 pb-4">
                    <Header isHome={isHome} />
                </header>

                {/* 메인 콘텐츠 */}
                <main
                    className={`flex-1 relative px-8 lg:px-12 pb-8 ${
                        isHome
                            ? "overflow-hidden"
                            : isScrollable
                                ? "overflow-y-auto no-scrollbar bg-white"
                                : "overflow-hidden bg-white"
                    }`}
                >
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* 모바일 콘텐츠 */}
            <div id="mobile-container" className="md:hidden h-[calc(100vh-60px)] overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}