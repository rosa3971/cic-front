import type {IImageItem} from "../../image/Image.type.ts";

export interface IFurniture {
    id: number;

    furnitureCode: string;

    title: string;
    width: string;
    height: string;
    depth: string;
    description: string;

    thumbnailUrls?: string[];
    status:string;
    isPublic:boolean;
    images: IImageItem[];
}