import ImageUploader from "../../../components/common/image-manager/ImageUploader.tsx";
import type { IProjectFormState } from "../../../types/admin/project/projectForm.ts";
import { uploadImages as uploadProject } from "../../../api/cloudinary.project.api.ts";

interface Props {
    form: IProjectFormState;
    setForm: React.Dispatch<React.SetStateAction<IProjectFormState>>;
    isEdit: boolean;
    setDeletedImages?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ProjectForm({ form, setForm, isEdit, setDeletedImages }: Props) {
    const { project, thumbnails } = form;

    return (
        <div className="space-y-4">
            {/* 이미지 */}
            <ImageUploader
                images={project.images}
                setImages={(images) =>
                    setForm((prev): IProjectFormState => ({
                        ...prev,
                        project: {
                            ...prev.project,
                            images:
                                typeof images === "function"
                                    ? images(prev.project.images)
                                    : images,
                        },
                    }))
                }
                thumbnails={thumbnails}
                setThumbnails={(thumbs) =>
                    setForm((prev) => ({
                        ...prev,
                        thumbnails:
                            typeof thumbs === "function"
                                ? thumbs(prev.thumbnails)
                                : thumbs,
                    }))
                }
                isEdit={isEdit}
                viewType="slider"
                uploadFn={uploadProject}
                setDeletedImages={setDeletedImages || (() => {})}
            />

            {/* 하단 정보 좌우 영역 */}
            <section className="bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
                    {/* 좌측 */}
                    <div className="space-y-2 text-sm">
                        {[
                            { label: "코드", key: "projectCode" },
                            { label: "완공", key: "completion" },
                            { label: "소재지", key: "location" },
                            { label: "용도", key: "type" },
                            { label: "작업", key: "scope" },
                            { label: "사진촬영", key: "photography" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <span className="text-gray-400">{label} : </span>

                                {isEdit ? (
                                    <input
                                        value={(project as any)[key]}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                project: {
                                                    ...prev.project,
                                                    [key]: e.target.value,
                                                },
                                            }))
                                        }
                                        className="ml-2 outline-none"
                                    />
                                ) : (
                                    <span>{(project as any)[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 우측 */}
                    <div className="text-sm">
                        {isEdit ? (
                            <>
                                <textarea
                                    value={project.description || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            project: {
                                                ...prev.project,
                                                description: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full h-[200px] border p-3 resize-none leading-relaxed"
                                />
                                <p className="text-right text-xs text-gray-400">
                                    {project.description?.length} 자
                                </p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">{project.description}</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}