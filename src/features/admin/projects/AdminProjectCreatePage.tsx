import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm.tsx";
import type { IProjectFormState } from "../../../types/admin/project/projectForm.ts";
import { uploadImages } from "../../../api/cloudinary.project.api.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import { createAdminProject } from "../../../api/project.api.ts";

export default function AdminProjectCreatePage() {
    const navigate = useNavigate();

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
        thumbnails: [], // thumbnail: null → thumbnails: []
    });

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        const { project, thumbnails } = form;

        try {
            setLoading(true);
            setStatusMessage("업로드 중...");

            // 썸네일 업로드 (파일이 있는 것만 업로드, 이미 URL인 건 그대로 사용)
            const thumbnailUrls = await Promise.all(
                thumbnails.map(async (thumb: any) => {
                    if (thumb.file) {
                        return await uploadImages(thumb.file);
                    }
                    return thumb.imageUrl;
                })
            );

            // 이미지 업로드
            const imageUrls = project.images
                .map((img: any) => img.imageUrl)
                .filter((url) => !!url);

            const dto = {
                projectCode: project.projectCode,
                completion: project.completion,
                location: project.location,
                type: project.type,
                scope: project.scope,
                photography: project.photography,
                description: project.description,
                thumbnailUrls, // thumbnailUrl → thumbnailUrls (배열)
                imageUrls,
                isPublic: project.isPublic,
            };

            await createAdminProject(dto);

            navigate("/admin/project/list", { replace: true });
        } catch (e) {
            setError("저장 중 오류 발생");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full min-h-screen px-16">
            <div className="flex items-start justify-between gap-6 mb-10">
                <h1 className="text-3xl font-cic font-light uppercase">
                    프로젝트 등록
                </h1>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate("/admin/project/list")}
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

            <ProjectForm form={form} setForm={setForm} isEdit={true} />
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