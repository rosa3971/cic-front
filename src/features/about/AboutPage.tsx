import { useEffect, useState } from "react";
import { getAbout } from "../../api/about.api.ts";
import SEO from "../../components/seo/SEO.tsx";

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAbout()
            .then(res => {
                setData(res.data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex flex-col pt-8 md:pt-14 pb-8 w-full  mx-auto animate-pulse">
                <div className="flex-1 w-full min-h-[50vh] bg-zinc-200 rounded-md" />
                <div className="mt-6 space-y-2 flex flex-col items-end">
                    <div className="w-48 h-4 bg-zinc-200 rounded" />
                    <div className="w-64 h-4 bg-zinc-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto min-h-[calc(100vh-140px)] flex flex-col items-center justify-center pb-8">
            <SEO
                title="About"
                description="CIC Studio(씨아이씨스튜디오)를 소개합니다. 공간과 사람을 연결하는 인테리어 디자인 스튜디오입니다."
                image={data?.imageUrl}
                url="/about"
            />
            {/* 이미지 영역 */}
            <section className="w-full flex items-center justify-center  overflow-hidden rounded-md min-h-[300px] max-h-[65vh]">
                {data?.imageUrl ? (
                    <img
                        src={data.imageUrl}
                        alt="About"
                        className="
                    max-w-full
                    max-h-[65vh]
                    w-auto
                    h-auto
                    object-contain
                    transition-all
                    duration-500
                "
                    />
                ) : (
                    <div className="w-full min-h-[300px] bg-zinc-200 flex items-center justify-center text-zinc-400">
                        No Image Available
                    </div>
                )}
            </section>

            {/* 브랜드 소개 */}
            <section className="mt-10 mb-10 px-4 md:px-0 w-full">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm text-center">
                    {data?.content}
                </p>
            </section>
        </div>
    );
}