import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import AlertModal from "../../components/common/modal/AlertModal.tsx";
import SEO from "../../components/seo/SEO.tsx";

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const [isContactModalOpen, setIsContactModalOpen] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            await emailjs.sendForm(
                'service_cic_contact',   // 서비스 ID
                import.meta.env.VITE_EMAILJS_TEMPLATEID,  // 템플릿 ID
                formRef.current!,
                import.meta.env.VITE_EMAILJS_KEY    // 공개 키
            );
            setStatusMessage("상담 문의가 성공적으로 전송되었습니다.");
            formRef.current?.reset(); // 폼 초기화
        } catch (error) {
            console.error(error);
            setError("전송에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="px-4 space-y-6 md:space-y-10 h-full">
            <SEO
                title="Contact"
                description="CIC Studio에 문의하세요. 서울 강동구 풍성로42길 22에 위치한 씨아이씨스튜디오입니다. 전화: 02-476-9116, 이메일: cicstudio@cicworks.com"
                url="/contact"
            />
            {/* 제목 */}
            {/*<section className="hidden md:block text-center space-y-4" aria-hidden="true">*/}
            {/*    <p className="text-3xl font-light tracking-wide">*/}
            {/*        CONTACT*/}
            {/*    </p>*/}
            {/*</section>*/}

            {/* 핵심: 2:1 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-20 md:items-stretch pt-10">

                {/* 좌측 (2) - 이미지 */}
                <div className="hidden md:flex md:col-span-2 order-2 md:order-1">
                    <img
                        src="/images/contact/contact.png"
                        alt="CIC Studio 연락처 안내"
                        className="w-full h-auto max-h-[350px] object-contain"
                    />
                </div>

                {/* 우측 (1) - SNS 영역 */}
                <div className="order-1 md:order-2 md:min-h-0 flex flex-col ">
                    {/* CONTACT 제목 - 페이지의 유일한 H1 */}
                    {/*<h1 className="text-2xl font-light tracking-wide text-center md:text-3xl md:text-left pb-16 md:pb-4 md:hidden">*/}
                    {/*    CONTACT*/}
                    {/*</h1>*/}

                    <div className="space-y-2">
                        <p className="text-sm gap-2">
                            <span className="w-5">CIC Studio</span>
                        </p>
                        <p className="text-sm gap-2">
                            <span className="w-5">씨아이씨스튜디오</span>
                        </p>
                    </div>
                    <div className=" pt-6">
                        <a
                            href="https://map.kakao.com/link/search/강동구 풍성로42길 22"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <p className="text-sm">
                                서울시 강동구 풍성로42길 22, 102
                            </p>
                        </a>
                    </div>
                    <div className="space-y-2 pt-6">
                        <a href="tel:024769116" className="flex gap-2 text-sm ">
                            <span className="w-5">T.</span>
                            <span>02-476-9116</span>

                        </a>

                        <a href="tel:01082346833" className="flex gap-2 text-sm ">
                            <span className="w-5">M.</span>
                            <span>010-8234-6833</span>
                        </a>
                        <a href="tel:01073237527" className="flex gap-2 text-sm ">
                            <span className="w-5"></span>
                            <span>010-7323-7527</span>
                        </a>
                        <a href="mailto:cicstudio@cicworks.com" className="flex gap-2 text-sm ">
                            <span className="w-5">E.</span>
                            <span>cicstudio@cicworks.com</span>
                        </a>
                    </div>
                    <div className=" pt-6">
                        {/* 인스타 */}
                        <a
                            href="https://www.instagram.com/cic_studio_/"
                            target="_blank"
                            className="block"
                        >
                            <p className="text-sm ">Instagram</p>
                        </a>
                    </div>
                    <div className=" pt-6">
                        {/* 블로그 */}
                        <a
                            href="https://blog.naver.com/cic_studio"
                            target="_blank"
                            className="block "
                        >
                            <p className="text-sm ">Blog</p>
                        </a>
                    </div>
                    <div className="flex pt-6">
                        <button
                            type="button"
                            onClick={() => setIsContactModalOpen(true)}
                            className="text-sm underline underline-offset-4 hover:opacity-70 transition"
                        >
                            Project Inquiry
                        </button>
                    </div>
                </div>
            </div>
            {isContactModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            type="button"
                            onClick={() => setIsContactModalOpen(false)}
                            className="absolute top-4 right-4 text-2xl"
                        >
                            ×
                        </button>

                        <form
                            ref={formRef}
                            onSubmit={async (e) => {
                                await handleSubmit(e);
                                setIsContactModalOpen(false);
                            }}
                            className="space-y-4"
                        >
                                <div className="space-y-0 md:space-y-2 text-sm order-1 md:order-2 text-left">
                                    <div className="flex items-center gap-2 md:gap-4 text-sm">
                                        <span className="w-24 shrink-0">고객명 :</span>
                                        <input
                                            name="user_name"
                                            required
                                            placeholder="고객명"
                                            className="flex-1 p-2 focus:outline-none "/>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 ">
                                        <span className="w-24 shrink-0 ">연락처 :</span>
                                        <input
                                            name="user_contact"
                                            required
                                            placeholder="010-1234-5678"
                                            className="flex-1 p-2 focus:outline-none "/>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 ">
                                        <span className="w-24 shrink-0">공사 예정지 :</span>
                                        <input
                                            name="location"
                                            placeholder="서울시 강동구"
                                            className="flex-1 p-2 focus:outline-none "/>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <span className="w-24 shrink-0">공사 시기 :</span>
                                        <input
                                            name="period"
                                            placeholder="2026.12"
                                            className="flex-1 p-2 focus:outline-none "/>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <span className="w-24 shrink-0">예산 :</span>
                                        <input
                                            name="budget"
                                            placeholder="00만원"
                                            className="flex-1 p-2 focus:outline-none "/>
                                    </div>
                                    <div className="mt-auto md:pt-4">
                                        <div className=" gap-2 md:gap-4">
                                            <p className="text-sm mb-2">문의 내용</p>
                                            <textarea
                                                name="message"
                                                required
                                                placeholder="문의 내용은 자유롭게 적어주시면 됩니다."
                                                className="w-full border border-gray-300 p-2 h-40 md:h-56"
                                            />
                                        </div>
                                        <div className="flex justify-center md:mt-1">
                                            <button
                                                type="submit"
                                                disabled={isSending}
                                                className="w-full md:w-auto px-10 py-3 bg-black text-white  hover:bg-gray-800 disabled:bg-gray-400 active:scale-[0.98] transition"
                                            >
                                                {isSending ? "전송 중..." : "상담 문의하기"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                    </div>
                </div>
            )}
            <AlertModal
                open={!!statusMessage}
                message={statusMessage || ""}
                onClose={() => setStatusMessage(null)}
            />
            <AlertModal
                open={!!error}
                message={error || ""}
                onClose={() => setError(null)}
            />
        </div>
    );
}