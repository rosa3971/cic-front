
export interface IImageItem {
    id?: string | number;
    imageUrl: string;
    publicId: string;
}

export interface ThumbnailItem extends IImageItem {
    file?: File;
    preview?: string;
}