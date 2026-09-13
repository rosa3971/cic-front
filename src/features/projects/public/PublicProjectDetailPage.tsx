import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProject, getPublicProjectList } from "../../../api/project.api.ts";
import { optimizeImage } from "../../../utils/imageUtils.ts";
import SEO from "../../../components/seo/SEO.tsx";
import ThumbnailSlide from "../../../components/common/image-manager/ThumbnailSlide.tsx";

export default function PublicProjectDetailPage() {
    const { projectCode } = useParams<{ projectCode: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<any>(null);
    const [projectList, setProjectList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = project?.imageUrls || [];
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        if (!projectCode) return;

        setIsLoading(true);
        setProject(null);
        setCurrentIndex(0);

        // 상세 데이터 먼저 로드 (속도 최적화)
        getPublicProject(projectCode).then(res => {
            setProject(res.data);

            // 만약 프로젝트에 이미지가 없다면 바로 로딩 해제
            if (!res.data.imageUrls || res.data.imageUrls.length === 0) {
                setIsLoading(false);
            }
        }).catch(() => {
            setIsLoading(false);
        });

        // 리스트는 모바일에서만 필요하므로 조건부 호출
        if (window.innerWidth < 768) {
            getPublicProjectList().then(res => setProjectList(res.data));
        }
    }, [projectCode]);

    const handleImageLoad = () => {
        setIsLoading(false);
    };


    if (!project) return <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>;
    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };


    return (
        <div className="w-full min-h-screen bg-white flex justify-center overflow-x-hidden">
            <SEO
                title={`${project.projectCode}`}
                description={project.description ? project.description.slice(0, 120) : `CIC Studio 인테리어 프로젝트 ${project.projectCode}. ${project.location || ""} ${project.type || ""}`}
                image={images[0]}
                url={`/works/interior/${projectCode}`}
                type="article"
            />
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                </div>
            )}

            <section className="w-full max-w-[650px] flex flex-col px-4 md:px-0">

                {/* ================= 이미지 영역 ================= */}
                <div className="w-full">
                    {/* 모바일: 세로 나열 (스크롤 형식) */}
                    <div className="block md:hidden space-y-4">
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

                    {/* 웹: 슬라이더 (높이 고정, 너비 가변, 이미지 교체 방식) */}
                    <div className="hidden md:block">
                        <div className="relative w-full h-[60vh] flex items-center justify-center bg-white">
                            {images.length > 0 && (
                                <img
                                    // key를 제거하여 이미지 전환 시 깜빡임 방지 및 속도 유지
                                    src={optimizeImage(images[currentIndex], 1000)}
                                    className="max-w-full max-h-full object-contain"
                                    alt="project-img"
                                    fetchPriority="high"
                                    onLoad={handleImageLoad}
                                />
                            )}
                            {/* 좌우 내비게이션 컨트롤 */}
                            <div className="absolute inset-0 flex">
                                <div className="flex-1 cursor-pointer group" onClick={handlePrev}>
                                    <button className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-5xl font-extralight text-zinc-400 hover:text-zinc-900">{"<"}</button>
                                </div>
                                <div className="flex-1 cursor-pointer group" onClick={handleNext}>
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-5xl font-extralight text-zinc-400 hover:text-zinc-900">{">"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= 상세 정보 영역 ================= */}
                <section className="py-20 md:py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                        {/* [웹 우측] 프로젝트 스펙: 스크롤 없이 고정 */}
                        <div className="text-sm md:text-right md:order-2 md:col-span-1">
                            <div className=" mb-2">{project.projectCode}.</div>
                            <div className="space-y-0.5 text-gray-700">
                                <div className="grid grid-cols-[60px_1fr] md:block">
                                    <span className="md:hidden">완공 :</span> <span>{project.completion}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] md:block">
                                    <span className="md:hidden">소재지 :</span> <span>{project.location}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] md:block">
                                    <span className="md:hidden">용도 :</span> <span>{project.type}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] md:block">
                                    <span className="md:hidden">작업 :</span> <span>{project.scope}</span>
                                </div>
                                <div className="grid grid-cols-[60px_1fr] md:block">
                                    <span className="md:hidden">촬영 :</span> <span>{project.photography}</span>
                                </div>
                            </div>
                        </div>


                        {/* [웹 좌측] 설명 영역: 고정 높이와 개별 스크롤 부여 */}
                        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed md:order-1
                                        md:col-span-2 md:h-[25vh] md:overflow-y-auto md:pr-4 scrollbar-hide">
                            {project.description}
                        </div>


                    </div>
                </section>

                {/* ================= 모바일 전용: 다음 프로젝트 리스트 ================= */}
                {projectList.length > 0 && (
                    <section className="py-20 space-y-10 md:hidden border-t border-gray-200">
                        <div className="space-y-16">
                            {projectList.map((pl) => (
                                <div
                                    key={pl.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/Works/Interior/${pl.projectCode}`)}
                                >
                                    <div className="w-full aspect-[4/3]"> {/* 명시적 비율/높이 부여 */}
                                        <ThumbnailSlide
                                            urls={(pl.thumbnailUrls || []).map((url: string) => optimizeImage(url, 700))}
                                            className="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <div className="mt-4 text-left">
                                        <p className="text-sm font-medium tracking-tight">{pl.projectCode}.</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{pl.completion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </section>
        </div>
    );
}