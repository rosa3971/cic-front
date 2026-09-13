import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import ImageUploader from "../../../components/common/image-manager/ImageUploader.tsx";
import { uploadImages as uploadFurniture } from "../../../api/cloudinary.furniture.api.ts";

interface Props {
    form: IFurnitureFormState
    setForm: React.Dispatch<React.SetStateAction<IFurnitureFormState>>;
    isEdit: boolean;
    setDeletedImages?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FurnitureForm({ form, setForm, isEdit, setDeletedImages }: Props) {
    const { furniture, thumbnails } = form;


    return (
         <div className="w-full h-[calc(100vh-120px)] flex gap-6">

            {/* 왼쪽 - 이미지 영역 */}
            <div className="w-2/3 h-full overflow-y-auto space-y-6 pr-2 no-scrollbar">
                {/* 이미지 리스트 */}
                <ImageUploader
                    images={furniture.images}
                    setImages={(images) =>
                        setForm((prev): IFurnitureFormState => ({
                            ...prev,
                            furniture: {
                                ...prev.furniture,
                                images:
                                    typeof images === "function"
                                        ? images(prev.furniture.images)
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
                    viewType="vertical"
                    uploadFn={uploadFurniture}
                    setDeletedImages={setDeletedImages || (() => {})}
                />

            </div>

            {/*오른쪽 - 정보 (고정) */}
            <div className="w-1/3 h-full flex flex-col">

                <div className="sticky top-10 space-y-6 bg-white p-4 shadow-sm">

                    {/* 기본 정보 */}
                    <div className="space-y-3 text-sm">

                        {[
                            { label: "code", key: "furnitureCode" },
                            { label: "title", key: "title" },
                            { label: "width", key: "width" },
                            { label: "depth", key: "depth" },
                            { label: "height", key: "height" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <span className="text-gray-400">{label} : </span>

                                {isEdit ? (
                                    <input
                                        value={(furniture as any)[key] ?? ""}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                furniture: {
                                                    ...prev.furniture,
                                                    [key]: e.target.value,
                                                },
                                            }))
                                        }
                                        className="ml-2 border-b outline-none"
                                    />
                                ) : (
                                    <span>{(furniture as any)[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 설명 */}
                    <div>
                        {isEdit ? (
                            <>
                                <textarea
                                    value={furniture.description || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            furniture: {
                                                ...prev.furniture,
                                                description: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full h-[200px] border p-3 resize-none"
                                />
                                <p className="text-right text-xs text-gray-400">
                                    {furniture.description?.length} 자
                                </p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">
                                {furniture.description}
                            </p>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}