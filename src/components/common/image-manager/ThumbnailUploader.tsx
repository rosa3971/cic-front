import { useState, useEffect } from "react";
import ImageCropModal from "./ImageCropModal.tsx";
import { isVideoUrl } from "../../../utils/imageUtils.ts";
import type { IImageItem } from "../../../types/image/Image.type.ts";

interface ThumbnailItem extends IImageItem {
    file?: File;
    preview?: string;
}

interface Props {
    thumbnails: ThumbnailItem[];
    setThumbnails: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>;
    isEdit?: boolean;
}

export default function ThumbnailUploader({
                                              thumbnails,
                                              setThumbnails,
                                              isEdit,
                                          }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cropQueue, setCropQueue] = useState<File[]>([]);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [autoPlay, setAutoPlay] = useState(true); // 목록 클릭 시 자동재생 잠깐 멈추기 용

    // 자동 슬라이드
    useEffect(() => {
        if (!autoPlay || thumbnails.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
        }, 2000);
        return () => clearInterval(timer);
    }, [thumbnails.length, autoPlay]);

    useEffect(() => {
        if (currentIndex >= thumbnails.length) {
            setCurrentIndex(Math.max(0, thumbnails.length - 1));
        }
    }, [thumbnails.length, currentIndex]);

    // 크롭 큐 처리
    useEffect(() => {
        if (!tempImage && cropQueue.length > 0) {
            setTempImage(URL.createObjectURL(cropQueue[0]));
        }
    }, [cropQueue, tempImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);

        const videos = fileArray.filter((f) => f.type.startsWith("video/"));
        videos.forEach((file) => {
            setThumbnails((prev) => [
                ...prev,
                { id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) } as ThumbnailItem,
            ]);
        });

        const images = fileArray.filter((f) => !f.type.startsWith("video/"));
        if (images.length > 0) {
            setCropQueue((prev) => [...prev, ...images]);
        }

        e.target.value = "";
    };

    const handleCropComplete = (croppedFile: File) => {
        setThumbnails((prev) => [
            ...prev,
            { id: crypto.randomUUID(), file: croppedFile, preview: URL.createObjectURL(croppedFile) } as ThumbnailItem,
        ]);
        setTempImage(null);
        setCropQueue((prev) => prev.slice(1));
    };

    const handleCropClose = () => {
        setTempImage(null);
        setCropQueue((prev) => prev.slice(1));
    };

    const handleRemove = (index: number) => {
        setThumbnails((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <section className="border p-2 bg-white shadow-sm mb-4">
            {/* 큰 미리보기 (크로스페이드 자동 슬라이드) */}
            <div className="relative aspect-square max-w-[300px] mx-auto flex items-center justify-center bg-gray-100 overflow-hidden">
                {thumbnails.length === 0 ? (
                    <div className="text-gray-400 text-sm">썸네일</div>
                ) : (
                    thumbnails.map((thumb, i) => {
                        const src = thumb.preview || thumb.imageUrl;
                        const isVideo = thumb.file?.type?.startsWith("video/") || isVideoUrl(src);

                        return isVideo ? (
                            <video
                                key={thumb.id}
                                src={src}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ${
                                    i === currentIndex ? "opacity-100" : "opacity-0"
                                }`}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        ) : (
                            <img
                                key={thumb.id}
                                src={src}
                                alt=""
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1000ms] ${
                                    i === currentIndex ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        );
                    })
                )}

                {isEdit && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                        사진 / 영상 추가
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </div>

            {/* 하단 썸네일 목록 */}
            {thumbnails.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-center mt-3">
                    {thumbnails.map((thumb, i) => {
                        const src = thumb.preview || thumb.imageUrl;
                        const isVideo = thumb.file?.type?.startsWith("video/") || isVideoUrl(src);

                        return (
                            <div
                                key={thumb.id}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    setAutoPlay(false); // 클릭하면 자동재생 멈춤
                                }}
                                className={`relative w-14 h-14 rounded overflow-hidden border-2 cursor-pointer flex-shrink-0 ${
                                    i === currentIndex ? "border-black" : "border-transparent"
                                }`}
                            >
                                {isVideo ? (
                                    <video src={src} className="w-full h-full object-cover" muted />
                                ) : (
                                    <img src={src} className="w-full h-full object-cover" alt="" />
                                )}

                                {isEdit && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(i);
                                        }}
                                        className="absolute top-0 right-0 bg-black/60 text-white text-[10px] w-4 h-4 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {tempImage && (
                <ImageCropModal
                    image={tempImage}
                    onCropComplete={handleCropComplete}
                    onClose={handleCropClose}
                />
            )}
        </section>
    );
}