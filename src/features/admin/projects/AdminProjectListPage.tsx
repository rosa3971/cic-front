import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    deleteAdminProject,
    getAdminProjectList,
    togglePublic,
    updateProjectOrder,
} from "../../../api/project.api.ts";
import SortableList from "../../../components/common/displayOrder/SortableList.tsx";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import ConfirmModal from "../../../components/common/modal/ConfirmModal.tsx";
import ThumbnailSlide from "../../../components/common/image-manager/ThumbnailSlide.tsx";

export default function AdminProjectListPage() {
    const navigate = useNavigate();

    const [projects, setProjects] = useState<any[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditOrder, setIsEditOrder] = useState(false);
    const [tempList, setTempList] = useState<any[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAdminProjectList().then((res) => {
            setProjects(res.data);
        });
    }, []);

    // 공개 토글
    const handleToggle = async (id: number, current: boolean) => {
        await togglePublic(id, !current);
        const res = await getAdminProjectList();
        setProjects(res.data);
    };

    // 삭제
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        await deleteAdminProject(deleteId);
        setProjects((prev) => prev.filter((p) => p.id !== deleteId));
        setDeleteId(null);
        setStatusMessage("삭제 완료");
    };

    // 순서 저장
    const handleOrderChange = async (newList: any[]) => {
        const total = newList.length;

        const dto = newList.map((item, index) => ({
            id: item.id,
            displayOrder: total - index,
        }));

        await updateProjectOrder(dto);
        setProjects(newList);
        setTempList([]);
        setStatusMessage("순서 변경 완료");
        setIsEditOrder(false);
    };

    return (
        <div className="h-full min-h-screen px-16">
            {/* 상단 */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-md md:text-3xl font-cic font-light uppercase">
                    Project List
                </h1>

                <div className="flex gap-2">
                    {!isEditOrder ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditOrder(true);
                                    setTempList(projects);
                                }}
                                className="px-3 py-1.5 bg-zinc-200 text-xs rounded hover:bg-zinc-300"
                            >
                                순서 변경
                            </button>

                            <button
                                onClick={() => navigate("/admin/project/create")}
                                className="px-3 py-1.5 bg-zinc-900 text-white text-xs rounded"
                            >
                                프로젝트 등록
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditOrder(false);
                                }}
                                className="px-3 py-1.5 bg-gray-200 text-xs rounded"
                            >
                                취소
                            </button>

                            <button
                                onClick={() => handleOrderChange(tempList)}
                                className="px-3 py-1.5 bg-black text-white text-xs rounded"
                            >
                                저장
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 리스트 */}
            <div className="space-y-4">

                {isEditOrder ? (
                    <SortableList
                        items={tempList}
                        getId={(p) => p.id}
                        onChangeOrder={(newList) => setTempList(newList)}
                        renderItem={(p) => (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 bg-white cursor-grab border rounded">
                                <div className="w-full h-[200px]">
                                    <ThumbnailSlide
                                        urls={p.thumbnailUrls || []}
                                        className="w-full h-full object-cover rounded" />
                                </div>
                                <div>
                                    <p>{p.projectCode}</p>
                                    <p>{p.completion}</p>
                                </div>
                            </section>
                        )}
                    />
                ) : (

                    projects.map((p) => (
                        <section
                            key={p.id}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-start cursor-pointer pb-10"
                            onClick={() => navigate(`/Admin/Project/${p.id}`)}
                        >
                            {/* 왼쪽 여백 */}
                            <div className="hidden md:block"></div>

                            {/* 중앙 이미지 */}
                            <div className="w-full aspect-square overflow-hidden bg-zinc-50">
                                <ThumbnailSlide
                                    urls={p.thumbnailUrls || []}
                                    className="w-full h-full object-cover rounded transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                            {/* 텍스트 */}
                            <div className="p-2 md:p-4 flex flex-col justify-between gap-4 hover:bg-zinc-50">
                                <div className="space-y-2">
                                    <p>{p.projectCode}.</p>
                                    <p>{p.completion}</p>

                                    <div className="flex gap-2 mt-2">
                                        {/* 공개 토글 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(p.id, p.isPublic);
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                p.isPublic
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {p.isPublic ? "공개" : "비공개"}
                                        </button>

                                        {/* 삭제 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(p.id);
                                            }}
                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))
                )}
            </div>
            <AlertModal
                open={!!statusMessage}
                message={statusMessage || ""}
                onClose={() => setStatusMessage(null)}
            />
            <ConfirmModal
                open={deleteId !== null}
                message="정말 삭제하시겠습니까?"
                onCancel={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
            />
            <AlertModal
                open={!!error}
                message={error || ""}
                onClose={() => setError(null)}
            />
        </div>
    );
}