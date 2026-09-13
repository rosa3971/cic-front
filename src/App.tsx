// src/App.tsx
import {Routes, Route} from "react-router-dom";
import { useSetAtom } from "jotai";
import { userAtom } from "./store/auth";
import Layout from "./components/layout/Layout";
import HomePage from "./features/home/HomePage";
import ContactPage from "./features/contact/ContactPage";
import LoginPage from "./features/Login/LoginPage.tsx";
import NewsPage from "./features/news/NewsPage.tsx"
import FurniturePage from './features/furniture/FurniturePage.tsx'
import PublicProjectPage from "./features/projects/public/PublicProjectPage.tsx";
import PublicProjectDetailPage from "./features/projects/public/PublicProjectDetailPage.tsx";
import AdminProjectListPage from "./features/admin/projects/AdminProjectListPage.tsx";
import AdminProjectDetailPage from "./features/admin/projects/AdminProjectDetailPage.tsx";
import AdminProjectCreatePage from "./features/admin/projects/AdminProjectCreatePage.tsx";
import AboutPage from "./features/about/AboutPage.tsx";
import AdminHomeImagesPage from "./features/admin/home/AdminHomeImagesPage.tsx";
import AdminRoute from "./routes/AdminRoute.tsx";
import {useEffect} from "react";
import {getUserFromToken} from "./api/auth.api.ts";
import AdminFurnitureListPage from "./features/admin/furniture/AdminFurnitureListPage.tsx";
import FurnitureDetailPage from "./features/furniture/FurnitureDetailPage.tsx";
import AdminFurnitureDetailPage from "./features/admin/furniture/AdminFurnitureDetailPage.tsx";
import AdminFurnitureCreatePage from "./features/admin/furniture/AdminFurnitureCreatePage.tsx";
import ScrollToTop from "./components/layout/ScrollToTop.tsx";
import AdminAboutPage from "./features/admin/about/AdminAboutPage.tsx";

console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);

function App() {
    const setUser = useSetAtom(userAtom);

    useEffect(() => {
        const user = getUserFromToken();
        setUser(user);
    }, [setUser]);



    return (
        <>
            <ScrollToTop />
                <Routes>
            {/* Layout (스크롤 있음) */}
            <Route element={<Layout />}>
            {/* 메인 */}
                <Route path="/news" element={<NewsPage />} />
                {/* Works - FurniturePage (리스트) */}
                <Route path="/works/furniture" element={<FurniturePage />} />

                {/* Works - Interior (리스트) */}
                <Route path="/works/interior" element={<PublicProjectPage />} />

            </Route>


            {/* Layout (스크롤 없음) */}
            <Route element={<Layout isScrollable={false} />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Login */}
                <Route path="/login" element={<LoginPage />} />
                {/* Works - Interior (디테일) */}
                <Route path="/works/furniture/:furnitureCode" element={<FurnitureDetailPage />} />
                {/* Works - FurniturePage (디테일) */}
                <Route path="/works/interior/:projectCode" element={<PublicProjectDetailPage />} />

            </Route>

            {/* Admin */}    {/* Layout (스크롤 있음) */}
            <Route element={<Layout />}>
                <Route path="/admin" element={<AdminRoute />}>
                    <Route path="homeImage" element={<AdminHomeImagesPage />} />
                    <Route path="project/list" element={<AdminProjectListPage />} />
                    <Route path="project/create" element={<AdminProjectCreatePage />} />
                    <Route path="Project/:projectId" element={<AdminProjectDetailPage />}/>
                    <Route path="furniture/list" element={<AdminFurnitureListPage />} />
                </Route>
            </Route>
            {/* Admin */}    {/* Layout (스크롤 없음) */}
            <Route element={<Layout isScrollable={false} />}>
                <Route path="/admin" element={<AdminRoute />}>
                    <Route path="furniture/create" element={<AdminFurnitureCreatePage />} />
                    <Route path="furniture/:furnitureId" element={<AdminFurnitureDetailPage />}/>
                    <Route path="about" element={<AdminAboutPage />} />
                </Route>
            </Route>
        </Routes>
        </>
    );
}

export default App;
