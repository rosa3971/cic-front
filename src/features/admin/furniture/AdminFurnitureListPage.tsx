import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {deleteAdminFurniture, getAdminFurnitureList, togglePublic, updateFurnitureOrder} from "../../../api/furniture.api.ts";
import SortableList from "../../../components/common/displayOrder/SortableList.tsx";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import ConfirmModal from "../../../components/common/modal/ConfirmModal.tsx";
import { isVideoUrl } from "../../../utils/imageUtils.ts";


export default function AdminFurnitureListPage() {
    const navigate = useNavigate();

    const [furnitures, setFurnitures] = useState<any[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditOrder, setIsEditOrder] = useState(false);
    const [tempList, setTempList] = useState<any[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAdminFurnitureList().then(res => {
            setFurnitures(res.data);
        });
    }, []);

    const handleToggle = async (id: number, current: boolean) => {
        await togglePublic(id, !current);
        const res = await getAdminFurnitureList();
        setFurnitures(res.data);
    };

    // 삭제
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;

        await deleteAdminFurniture(deleteId);

        setFurnitures((prev) => prev.filter((p) => p.id !== deleteId));
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

        await updateFurnitureOrder(dto);
        setFurnitures(newList);
        setTempList([]);
        setStatusMessage("순서 변경 완료");
        setIsEditOrder(false);
    };


    return (
        <div className="h-full min-h-screen px-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <h1 className="text-md md:text-3xl font-cic font-light uppercase">
                    가구 리스트
                </h1>

                <div className="flex gap-2">
                    {!isEditOrder ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEditOrder(true);
                                    setTempList(furnitures);
                                }}
                                className="px-3 py-1.5 bg-zinc-200 text-xs rounded hover:bg-zinc-300"
                            >
                                순서 변경
                            </button>

                            <button
                                type="button"
                                className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs hover:bg-zinc-800 transition-colors"
                                onClick={() => navigate("/admin/furniture/create")}
                            >
                                가구 등록
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

            <div className="space-y-6">
                <div className="space-y-4">
                    {isEditOrder ? (
                        <SortableList
                            items={tempList}
                            getId={(p) => p.id}
                            onChangeOrder={(newList) => setTempList(newList)}
                            renderItem={(p) => (
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 bg-white cursor-grab border rounded">
                                    {isVideoUrl(p.thumbnailUrl) ? (
                                        <video
                                            src={p.thumbnailUrl}
                                            className="w-full h-[200px] object-cover rounded"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={p.thumbnailUrl}
                                            className="w-full h-[200px] object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p>{p.furnitureCode}</p>
                                        <p>{p.title}</p>
                                    </div>
                                </section>
                            )}
                        />
                    ) : (

                    furnitures.map((f) => (
                        <section
                            key={f.id}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-start cursor-pointer pb-10"
                            onClick={() => navigate(`/admin/furniture/${f.id}`)}
                        >
                            {/* 왼쪽 여백 */}
                            <div className="hidden md:block"></div>
                            {/* 중앙 이미지 */}
                            <div className="w-full aspect-square overflow-hidden bg-zinc-50">

                                {isVideoUrl(f.thumbnailUrl) ? (
                                    <video
                                        src={f.thumbnailUrl}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={f.thumbnailUrl}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        alt={f.furnitureCode}
                                    />
                                )}
                            </div>

                            {/* 텍스트 */}
                            <div className="w-full text-left p-2 md:p-4 flex flex-col justify-between gap-4 hover:bg-zinc-50 transition">

                                <div className="flex flex-col justify-center space-y-2 md:space-y-2">
                                    <p className="text-sm md:text-md text-zinc-700">{f.furnitureCode}.</p>
                                    <p className="text-sm md:text-md text-zinc-700">{f.title}</p>
                                    <div className="flex text-xs md:text-sm text-zinc-800 leading-none">
                                        <p className="text-xs text-zinc-500">{f.width}*</p>
                                        <p className="text-xs text-zinc-500">{f.depth}*</p>
                                        <p className="text-xs text-zinc-500">{f.height}</p>

                                    </div>
                                    <div className="flex items-center gap-2 mt-2">

                                        {/* 공개 토글 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(f.id, f.isPublic);
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                f.isPublic
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {f.isPublic ? "공개" : "비공개"}
                                        </button>

                                        {/* 삭제 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(f.id);
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

