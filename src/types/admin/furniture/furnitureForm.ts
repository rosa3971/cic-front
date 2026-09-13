import type {IFurniture} from "./IFurniture.ts";
import type {ThumbnailItem} from "../../image/Image.type.ts";


export interface IFurnitureFormState {
    furniture: IFurniture;
    thumbnails: ThumbnailItem[];
}