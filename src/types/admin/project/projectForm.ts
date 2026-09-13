
import type { IProject } from "./IProject";
import type {ThumbnailItem} from "../../image/Image.type.ts";


export interface IProjectFormState {
    project: IProject;
    thumbnails: ThumbnailItem[];
}