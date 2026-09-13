import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicFurniture, getPublicFurnitureList } from "../../api/furniture.api.ts";
import { optimizeImage } from "../../utils/imageUtils.ts";
import SEO from "../../components/seo/SEO.tsx";
import ThumbnailSlide from "../../components/common/image-manager/ThumbnailSlide.tsx";

export default function FurnitureDetailPage() {
    const { furnitureCode } = useParams<{ furnitureCode: string }>();
    const navigate = useNavigate();
    const [furniture, setFurniture] = useState<any>(null);
    const [furnitureList, setFurnitureList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const images = furniture?.imageUrls || [];

    useEffect(() => {
        if (!furnitureCode) return;

        setIsLoading(true);
        setFurniture(null);

        // 상세 데이터 로드
        getPublicFurniture(furnitureCode).then(res => {
            setFurniture(res.data);

            if (!res.data.imageUrls || res.data.imageUrls.length === 0) {
                setIsLoading(false);
            }
        }).catch(() => {
            setIsLoading(false);
        });


        // 모바일 리스트 데이터 로드
        if (window.innerWidth < 768) {
            getPublicFurnitureList().then(res => setFurnitureList(res.data));
        }

    }, [furnitureCode]);

    const handleImageLoad = () => {
        setIsLoading(false);
    };



    if (!furniture) return <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>;

    return (
        <div className="w-full flex flex-col md:flex-row bg-white">
            <SEO
                title={`${furnitureCode}`}
                description={furniture.description ? furniture.description.slice(0, 120) : `CIC Studio 가구 ${furnitureCode}: ${furniture.title}`}
                image={images[0]}
                url={`/works/furniture/${furnitureCode}`}
                type="article"
            />
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />

                </div>
            )}

            {/* ================= 1. 이미지 영역 ================= */}
            {/* 웹: 3/4 너비, 자체 스크롤 / 모바일: 세로 나열 */}
            <div className="w-full md:w-3/4">
                {/* 모바일 이미지 나열 */}
                <div className="block md:hidden space-y-4 px-4">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={optimizeImage(img, 800)}
                            className="w-full object-cover rounded-sm"
                            alt="mobile-img"
                            loading={index === 0 ? "eager" : "lazy"}
                            onLoad={index === 0 ? handleImageLoad : undefined}
                        />
                    ))}
                </div>

                {/* 웹 이미지 나열 (자체 스크롤) */}
                <div className="hidden md:flex flex-col items-center h-[calc(100vh-100px)] overflow-y-auto pb-20 space-y-4 no-scrollbar">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={optimizeImage(img, 1000)}
                            className="w-full max-w-[500px] object-cover"
                            alt="furniture"
                            onLoad={handleImageLoad}
                        />
                    ))}
                </div>
            </div>

            {/* ================= 2. 정보 영역 ================= */}
            {/* 웹: 우측 고정 / 모바일: 하단 노출 */}
            <div className="w-full md:w-1/4 px-6 md:pl-10 py-10 md:py-0">
                <div className="md:sticky md:top-0 space-y-3">
                    <p className="text-sm text-zinc-800 font-medium tracking-tighter">
                        {furnitureCode}.
                    </p>
                    <p className="text-sm text-zinc-600">
                        {furniture.title}
                    </p>
                    <p className="text-sm text-zinc-500">
                        {furniture.width} * {furniture.height} * {furniture.depth}
                    </p>

                    {/* 웹에서는 설명글이 길어질 경우 대비하여 개별 스크롤 가능하게 설정 */}
                    <p className="whitespace-pre-line text-sm text-zinc-600 pt-6 leading-relaxed md:max-h-[50vh] md:overflow-y-auto no-scrollbar">
                        {furniture.description}
                    </p>
                </div>

                {/* ================= 3. 모바일 전용 하단 리스트 ================= */}
                {furnitureList.length > 0 && (
                    <section className="mt-20 space-y-10 md:hidden border-t border-zinc-100 pt-10">
                        <div className="space-y-16">
                            {furnitureList.map((fl) => (
                                <div
                                    key={fl.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/works/furniture/${fl.furnitureCode}`)}
                                >
                                    <div className="w-full aspect-[4/3]"> {/* 명시적 비율/높이 부여 */}
                                        <ThumbnailSlide
                                            urls={(fl.thumbnailUrls || []).map((url: string) => optimizeImage(url, 700))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="mt-4 text-left">
                                        <p className="text-sm font-medium tracking-tight text-zinc-800">{fl.furnitureCode}.</p>
                                        <p className="text-xs text-zinc-500 mt-1">{fl.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}