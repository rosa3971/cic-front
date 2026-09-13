import FurnitureForm from "./FurnitureForm.tsx";
import { useState} from "react";
import {useNavigate} from "react-router-dom";
import {createAdminFurniture} from "../../../api/furniture.api.ts";
import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import {uploadImages} from "../../../api/cloudinary.furniture.api.ts";


export default function AdminFurnitureCreatePage() {
    const navigate = useNavigate();


    const [form, setForm] = useState<IFurnitureFormState>({
        furniture: {
            id: 0,
            furnitureCode: "",
            title: "",
            width: "",
            height: "",
            depth: "",
            description: "",
            images: [],
            isPublic: true,
            status: "COMPLETED"
        },
        thumbnails: [],
    });
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleSave = async () => {
        const { furniture, thumbnails } = form;

        try {
            setLoading(true);
            setStatusMessage("업로드 중...");

            // 썸네일 배열 업로드 (파일이면 새로 업로드, 이미 URL이면 그대로)
            const thumbnailUrls = await Promise.all(
                thumbnails.map(async (thumb: any) => {
                    if (thumb.file) {
                        return await uploadImages(thumb.file);
                    }
                    return thumb.imageUrl;
                })
            );

            // 이미지 업로드
            const imageUrls = furniture.images
                .map((img: any) => img.imageUrl)
                .filter((url) => !!url);

            const dto = {
                furnitureCode:furniture.furnitureCode,
                title: furniture.title,
                width: furniture.width,
                height: furniture.height,
                depth: furniture.depth,
                description:furniture.description,
                thumbnailUrls,
                imageUrls,
                isPublic: furniture.isPublic,
            };

            await createAdminFurniture(dto);

            navigate("/admin/furniture/list", { replace: true });

        } catch (e) {
            setError("저장 중 오류 발생");
            console.error(e);
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full min-h-screen">


            <div className="flex items-start justify-between gap-6 mb-4">
                <h1 className="text-3xl font-cic font-light uppercase">
                    가구 등록
                </h1>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate("/admin/furniture/list")}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-200 hover:bg-gray-600 cursor-pointer"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "저장중..." : "저장"}
                    </button>
                </div>
            </div>

            <FurnitureForm
                form={form}
                setForm={setForm}
                isEdit={true}
            />
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
