import type {IImageItem} from "../../image/Image.type.ts";

export interface IProject {
    id?: number;

    projectCode: string;

    completion: string;
    location: string;
    type: string;
    scope: string;
    photography: string;
    description: string;

    thumbnailUrls?: string[];
    status:string;
    isPublic:boolean;
    images: IImageItem[];
}