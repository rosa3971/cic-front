import ThumbnailUploader from "./ThumbnailUploader.tsx";
import ImageGallerySlider from "./ImageGallerySlider.tsx";
import SortableImageList from "./SortableImageList.tsx";
import { useState } from "react";
import ImageGalleryVertical from "./ImageGalleryVertical.tsx";
import type {IImageItem, ThumbnailItem} from "../../../types/image/Image.type.ts";

interface Props {
    images: IImageItem[];
    setImages: React.Dispatch<React.SetStateAction<IImageItem[]>>;
    thumbnails: ThumbnailItem[];          // thumbnail → thumbnails
    setThumbnails: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>; // 변경
    isEdit?: boolean;
    viewType?: "slider" | "vertical";
    uploadFn: (file: File) => Promise<string>;
    setDeletedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ImageUploader({
                                          images,
                                          setImages,
                                          thumbnails,
                                          setThumbnails,
                                          isEdit = true,
                                          viewType,
                                          uploadFn,
                                          setDeletedImages
                                      }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 이미지 업로드
    const handleImageUpload = async  (files: FileList) => {
        if (!files || files.length === 0) return;

        try {
            setIsUploading(true);
        const fileArray = Array.from(files);

        // 병렬 업로드
        const uploadedUrls = await Promise.all(
            fileArray.map((file) => uploadFn(file))
        );
        const newImages = uploadedUrls.map((url) => ({
            id: crypto.randomUUID(),
            imageUrl: url,
        }));

        setImages((prev) => [...prev, ...newImages]);

        }   catch {
        setError("이미지 업로드에 실패했습니다.");
        } finally {
            setIsUploading(false); // 로딩 종료
        }
    };
    // 삭제
    const handleRemoveImage = (index: number) => {
        const removed = images[index];

        if (!removed) {
            console.warn("삭제할 이미지가 배열에 없습니다.");
            return;
        }

        //  Cloudinary 삭제용 저장
        if (removed?.imageUrl && typeof setDeletedImages === 'function') {
            setDeletedImages((prev) => {
                if (prev.includes(removed.imageUrl)) return prev;
                return [...prev, removed.imageUrl];
            });
        }

        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);

        setCurrentIndex((prev) =>{
            if (newImages.length === 0) return 0;
            if (index < prev) return prev - 1; // 앞에서 삭제
            return Math.min(prev, newImages.length - 1);
            }
        );
    };

    // 정렬
    const handleReorder = (newImages: IImageItem[]) => {
        setImages(newImages);
    };

    return (
        <div className="space-y-1">

            {/* 썸네일 */}
            <ThumbnailUploader
                thumbnails={thumbnails}
                setThumbnails={setThumbnails}
                isEdit={isEdit}
            />

            {/* 메인 이미지 */}

            {viewType === "slider" ? (
                <ImageGallerySlider
                    images={images}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    onRemove={handleRemoveImage}
                    isEdit={isEdit}
                />
            ) : (
                <ImageGalleryVertical
                images={images}
                onRemove={handleRemoveImage}
                isEdit={isEdit}
                />
            )}

            <div className="flex justify-end mb-2 mt-2">
            {/* 업로드 버튼 */}
                {isEdit && (
                    <label
                        className={`inline-flex items-center gap-2 px-4 py-2 text-white transition
                            ${isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-black cursor-pointer hover:bg-gray-800"
                        }`}
                    >
                        {/* 업로드 중일 때 아이콘/텍스트 변경 */}
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                업로드 중...
                            </>
                        ) : (
                            <>+ 이미지 추가</>
                        )}

                        <input
                            type="file"
                            multiple
                            hidden
                            disabled={isUploading} // 업로드 중 클릭 방지
                            onChange={(e) => handleImageUpload(e.target.files!)}
                        />
                    </label>
                )}
            </div>
            {/* 정렬 리스트 */}
            <SortableImageList
                images={images}
                setImages={handleReorder}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        </div>
    );
}