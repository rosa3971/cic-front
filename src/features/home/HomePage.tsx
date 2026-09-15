// src/features/home/pages/HomePage.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { getHomeImage } from "../../api/home.api.ts";
import { optimizeHomeImage } from "../../utils/imageUtils.ts";
import SEO from "../../components/seo/SEO.tsx";

const HOME_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    "name": "CIC Studio",
    "alternateName": "씨아이씨스튜디오",
    "url": "https://www.cicworks.com",
    "logo": "https://www.cicworks.com/images/favicon/favicon.svg",
    "description": "서울 강동구에 위치한 인테리어 디자인 스튜디오로, 공간 설계부터 가구 제작까지 총체적인 디자인 솔루션을 제공합니다.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "풍성로42길 22, 102",
        "addressLocality": "강동구",
        "addressRegion": "서울",
        "addressCountry": "KR"
    },
    "telephone": "02-476-9116",
    "email": "cicstudio@cicworks.com",
    "sameAs": [
        "https://www.instagram.com/cic_studio_/",
        "https://blog.naver.com/cic_studio"
    ]
};

type Slide = {
    id: number;
    imageUrl: string;
    orderIndex: number;
    isActive: boolean;
};

const PAGE_SIZE = 9; // 한 번에 몇 장씩 더 보여줄지 (3열 * 3행)

export default function HomePage() {
    const [images, setImages] = useState<Slide[]>([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(true);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await getHomeImage();
                const activeImages = (Array.isArray(res.data) ? res.data : [])
                    .filter((s: Slide) => s.isActive)
                    .sort((a, b) => a.orderIndex - b.orderIndex);

                setImages(activeImages);
            } catch (error) {
                console.error("Failed to fetch home images:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    // 스크롤이 하단 근처에 닿으면 더 보여주는 개수를 늘려준다 (무한 스크롤 느낌)
    const loadMore = useCallback(() => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, images.length));
    }, [images.length]);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: "300px" } // 바닥에 닿기 전에 미리 로드
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [loadMore]);

    if (isLoading) return <div className="min-h-screen" />;

    const visibleImages = images.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-white">
            <SEO url="/" jsonLd={HOME_JSON_LD} />

            {/* 헤더 높이만큼 상단 패딩 */}
            <div className="pt-[30px] lg:pt-[30px] px-4 lg:px-20 pb-20">
                {images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {visibleImages.map((slide, i) => (
                            <div
                                key={slide.id}
                                className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100"
                            >
                                <img
                                    src={optimizeHomeImage(slide.imageUrl)}
                                    alt=""
                                    loading={i < 3 ? "eager" : "lazy"}
                                    fetchPriority={i < 3 ? "high" : "low"}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-[60vh] bg-gray-100" />
                )}

                {/* 스크롤 감지용 sentinel */}
                {visibleCount < images.length && (
                    <div ref={sentinelRef} className="h-10 w-full" />
                )}
            </div>
        </div>
    );
}