import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminProject, patchAdminProject } from "../../../api/project.api.ts";
import { uploadImages, deleteImage } from "../../../api/cloudinary.project.api.ts";
import ProjectForm from "./ProjectForm.tsx";
import type { IProjectFormState } from "../../../types/admin/project/projectForm.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";

export default function AdminProjectDetailPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const [form, setForm] = useState<IProjectFormState>({
        project: {
            id: 0,
            projectCode: "",
            completion: "",
            location: "",
            type: "",
            scope: "",
            photography: "",
            description: "",
            images: [],
            isPublic: true,
            status: "COMPLETED",
        },
        thumbnails: [],
    });

    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        getAdminProject(Number(projectId)).then((res) => {
            setForm({
                project: res.data,
                thumbnails: (res.data.thumbnailUrls || []).map((url: string) => ({
                    id: crypto.randomUUID(),
                    imageUrl: url,
                })),
            });
        });
    }, [projectId]);

    useEffect(() => {
        if (!loading) {
            setStatusMessage(null);
        }
    }, [loading]);

    if (!form.project.id) {
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
        const { project, thumbnails } = form;

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

            const imageUrls = project.images
                .map((img: any) => img.imageUrl)
                .filter((url) => !!url);

            await patchAdminProject(Number(project.id), {
                projectCode: project.projectCode,
                completion: project.completion,
                location: project.location,
                type: project.type,
                scope: project.scope,
                photography: project.photography,
                description: project.description,
                status: project.status,
                isPublic: project.isPublic,
                thumbnailUrls,
                imageUrls,
            });

            await Promise.all(deletedImages.map((url) => deleteImage(url)));

            setIsEdit(false);
            setDeletedImages([]);
            setStatusMessage("저장 완료");
        } catch {
            setError("수정 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full min-h-screen px-4 md:px-16 py-6 md:py-10">
            <section className="flex items-center justify-between bg-white border px-5 py-2 mb-2 shadow-sm">
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
                                onClick={() => navigate("/admin/project/list")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsEdit(false)}
                                className="px-3 py-1 bg-red-500 text-white text-xs hover:bg-red-600"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => navigate("/admin/project/list")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">공개여부</span>

                    {isEdit ? (
                        <div
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    project: {
                                        ...prev.project,
                                        isPublic: !prev.project.isPublic,
                                    },
                                }))
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
                            ${form.project.isPublic ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full transition
                            ${form.project.isPublic ? "translate-x-6" : ""}`}
                            />
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                                form.project.isPublic
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {form.project.isPublic ? "공개" : "비공개"}
                        </span>
                    )}
                </div>
            </section>

            <ProjectForm
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
            <AlertModal open={!!error} message={error || ""} onClose={() => setError(null)} />
        </div>
    );
}