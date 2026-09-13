// src/features/works/components/FurniturePage.tsx

import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {getPublicFurnitureList} from "../../api/furniture.api.ts";
import SEO from "../../components/seo/SEO.tsx";
import ThumbnailSlide from "../../components/common/image-manager/ThumbnailSlide.tsx";


export default function FurniturePage() {
    const navigate = useNavigate();
    const [furnitures, setFurnitures] = useState<any[]>([]);

    useEffect(() => {
        getPublicFurnitureList().then(res => setFurnitures(res.data));

    }, []);

    return (
        <div className="h-full min-h-screen">
            <SEO
                title="Furniture"
                description="CIC Studio의 가구 작업물을 소개합니다. 공간에 맞는 맞춤 제작 가구 디자인을 확인하세요."
                url="/works/furniture"
            />
            <div className="space-y-6">
                <div className="space-y-4">
                    {furnitures.map((f) => (
                        <section
                            key={f.id}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-start cursor-pointer pb-10"
                            onClick={() => navigate(`/Works/Furniture/${f.furnitureCode}`)}
                        >
                            {/* 오른쪽 여백 */}
                            <div className="hidden md:block"></div>
                            {/* 중앙 이미지 */}
                            <div className="w-full aspect-square overflow-hidden bg-zinc-50">
                                <ThumbnailSlide
                                    urls={f.thumbnailUrls || []}
                                    className="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                            {/* 오른쪽 텍스트 영역: 이미지 윗선과 맞춤 */}
                            <div className="flex flex-col pt-0 md:pt-1">
                                <div className="pb-2">
                                    {/* 2. 상단 여백(pt)을 미세하게 조절하여 이미지의 테두리 두께와 시각적으로 맞춤 */}
                                    <p className="text-sm md:text-md text-zinc-800 mb-1 font-medium leading-none">
                                        {f.furnitureCode}.
                                    </p>
                                    <p className="text-xs md:text-sm text-zinc-800 leading-none">
                                        {f.title}.
                                    </p>
                                </div>

                                <div className="flex text-xs md:text-sm text-zinc-800 leading-none">
                                    <p className="text-xs text-zinc-500">{f.width}*</p>
                                    <p className="text-xs text-zinc-500">{f.depth}*</p>
                                    <p className="text-xs text-zinc-500">{f.height}</p>

                                </div>
                            </div>


                        </section>
                    ))}
                </div>
            </div>
        </div>


    );
}
