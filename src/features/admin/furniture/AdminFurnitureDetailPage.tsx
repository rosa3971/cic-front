import FurnitureForm from "./FurnitureForm.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getAdminFurniture, patchAdminFurniture} from "../../../api/furniture.api.ts";
import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import {uploadImages, deleteImage } from "../../../api/cloudinary.furniture.api.ts";

export default function AdminFurnitureDetailPage() {
    const navigate = useNavigate();
    const { furnitureId } = useParams<{ furnitureId: string }>();

    const [isEdit, setIsEdit] = useState(false);
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
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!furnitureId) return;

        getAdminFurniture(Number(furnitureId)).then((res) => {
            setForm({
                furniture: res.data,
                thumbnails: (res.data.thumbnailUrls || []).map((url: string) => ({
                    id: crypto.randomUUID(),
                    imageUrl: url,
                })),
            });
        });
    }, [furnitureId]);

    useEffect(() => {
        if (!loading) {
            setStatusMessage(null);
        }
    }, [loading]);


    if (!form.furniture.id) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">데이터 불러오는 중...</p>
                </div>
            </div>
        );
    }

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

            const imageUrls = furniture.images
                .map((img: any) => img.imageUrl)
                .filter((url) => !!url);

            await patchAdminFurniture(Number(furnitureId), {
                    furnitureCode:furniture.furnitureCode,
                    title: furniture.title,
                    width: furniture.width,
                    depth: furniture.depth,
                    height: furniture.height,
                    description:furniture.description,
                    status: furniture.status,
                    isPublic: furniture.isPublic,
                    thumbnailUrls,
                    imageUrls

            });

            // Cloudinary 삭제
            await Promise.all(deletedImages.map((url) => deleteImage(url)));

            setIsEdit(false);
            setDeletedImages([]); // 초기화
            setStatusMessage("저장 완료");
        } catch (e){
            console.error(e);
            setError("수정 실패");
        }finally {
            setLoading(false);
        }
  };


    //수정 취소
    const handleCancel = async () => {
        // const res = await getAdminFurniture(Number(furnitureId));
        // setForm(transformFurniture(res.data));
        setIsEdit(false);
    };



    return (

        <div className="h-full min-h-screen">
            <section className="flex items-center justify-between bg-white border px-5 py-2 mb-2 shadow-sm">

                {/* 좌측 */}
                <div className="flex gap-2">
                    {!isEdit ? (
                        <>
                            <button
                                onClick={() => setIsEdit(true)}
                                className="px-3 py-1 bg-black text-white text-xs hover:bg-gray-800 transition"
                            >
                                수정
                            </button>

                            <button
                                onClick={() => navigate("/admin/furniture/list")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700"
                            >
                                {loading ? "저장중..." : "저장"}
                            </button>

                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 bg-red-500 text-white text-xs hover:bg-red-600"
                            >
                                취소
                            </button>

                            <button
                                onClick={() => navigate("/admin/furniture/list")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    )}
                </div>


                {/* 우측 공개 상태 */}
                <div className="flex items-center gap-3">

                    <span className="text-sm text-gray-500">공개여부</span>

                    {isEdit ? (
                        <div
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    furniture: {
                                        ...prev.furniture,
                                        isPublic: !prev.furniture.isPublic,
                                    },
                                }))
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
                            ${form.furniture.isPublic ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full transition
                            ${form.furniture.isPublic ? "translate-x-6" : ""}`}
                            />
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                                form.furniture.isPublic
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {form.furniture.isPublic ? "공개" : "비공개"}
                        </span>
                    )}

                </div>

            </section>

            <FurnitureForm
                form={form}
                setForm={setForm}
                isEdit={isEdit}
                setDeletedImages={setDeletedImages}
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
