// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";
import MobileHeader from "./MobileHeader";

export default function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className={`w-full min-h-screen ${isHome ? "" : "bg-white"}`}>
            {/* 모바일 헤더 */}
            <header className="md:hidden h-[60px] flex items-center">
                <MobileHeader isHome={isHome} />
            </header>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:block w-full">
                {/* 상단 헤더: 위쪽 여백 추가, 높이는 auto로 내용에 맞게 */}
                <header className="relative z-[3] w-full px-[3%] pt-10 pb-16 flex items-center">
                    <Header isHome={isHome} />
                </header>

                {/* 메인 콘텐츠 */}
                <main className="relative w-full">
                    <Outlet />
                </main>
            </div>

            {/* 모바일 콘텐츠 */}
            <div className="md:hidden w-full">
                <Outlet />
            </div>
        </div>
    );
}