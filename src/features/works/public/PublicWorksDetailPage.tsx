import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProject, getPublicProjectList } from "../../../api/project.api.ts";
import { getPublicFurniture, getPublicFurnitureList } from "../../../api/furniture.api.ts";
import { optimizeImage } from "../../../utils/imageUtils.ts";
import SEO from "../../../components/seo/SEO.tsx";
import ThumbnailSlide from "../../../components/common/image-manager/ThumbnailSlide.tsx";

type LinkType = "interior" | "furniture";

export default function PublicWorksDetailPage() {
    // 통합 라우트: /works/:linkType/:worksCode
    const { linkType, worksCode } = useParams<{ linkType: LinkType; worksCode: string }>();
    const navigate = useNavigate();

    const [item, setItem] = useState<any>(null); // project 또는 furniture 데이터 통합
    const [siblingList, setSiblingList] = useState<any[]>([]); // 모바일용 다음 항목 리스트
    const [isLoading, setIsLoading] = useState(true);

    const images = item?.imageUrls || [];

    useEffect(() => {
        if (!linkType || !worksCode) return;

        setIsLoading(true);
        setItem(null);

        const fetchDetail =
            linkType === "interior"
                ? getPublicProject(worksCode)
                : getPublicFurniture(worksCode);

        fetchDetail
            .then((res) => {
                setItem(res.data);
                if (!res.data.imageUrls || res.data.imageUrls.length === 0) {
                    setIsLoading(false);
                }
            })
            .catch(() => {
                setIsLoading(false);
            });

        // 리스트는 모바일에서만 필요
        if (window.innerWidth < 768) {
            const fetchList =
                linkType === "interior" ? getPublicProjectList() : getPublicFurnitureList();
            fetchList.then((res) => setSiblingList(res.data));
        }
    }, [linkType, worksCode]);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    if (!item) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    // project는 projectCode, furniture는 furnitureCode 필드를 씀
    const code = item.projectCode ?? item.furnitureCode;

    return (
        <div className="w-full min-h-screen bg-white flex justify-center overflow-x-hidden">
            <SEO
                title={`${code}`}
                description={
                    item.description
                        ? item.description.slice(0, 120)
                        : `CIC Studio ${linkType === "interior" ? "인테리어 프로젝트" : "가구"} ${code}. ${item.location || ""} ${item.type || ""}`
                }
                image={images[0]}
                url={`/works/${linkType}/${worksCode}`}
                type="article"
            />
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                </div>
            )}

            <section className="w-full max-w-[1280px] flex flex-col px-4 md:px-0">
                <h1 className="mb-2 text-3xl text-center font-bold">{code}.</h1>
                <h1 className="mb-2 text-3xl text-center font-bold">{item.completion}</h1>

                {/* ================= 이미지 영역 ================= */}
                <div className="w-full pt-10">
                    {/* 모바일 & 데스크탑 공통: 세로 나열 (스크롤 형식) */}
                    <div className="space-y-4 md:space-y-6">
                        {images.map((img: string, index: number) => (
                            <img
                                key={index}
                                src={optimizeImage(img, index === 0 ? 1000 : 800)}
                                className="w-full object-cover rounded-sm"
                                alt={`works-img-${index}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "low"}
                                onLoad={index === 0 ? handleImageLoad : undefined}
                            />
                        ))}
                    </div>
                </div>

                {/* ================= 모바일 전용: 다음 항목 리스트 ================= */}
                {siblingList.length > 0 && (
                    <section className="py-20 space-y-10 md:hidden border-t border-gray-200">
                        <div className="space-y-16">
                            {siblingList.map((sl) => {
                                const siblingCode = sl.projectCode ?? sl.furnitureCode;
                                return (
                                    <div
                                        key={sl.id}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/works/${linkType}/${siblingCode}`)}
                                    >
                                        <div className="w-full aspect-[4/3]">
                                            <ThumbnailSlide
                                                urls={(sl.thumbnailUrls || []).map((url: string) => optimizeImage(url, 700))}
                                                className="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-4 text-left">
                                            <p className="text-sm font-medium tracking-tight">{siblingCode}.</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{sl.completion}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </section>
        </div>
    );
}