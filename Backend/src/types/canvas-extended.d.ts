import { Canvas, Image, ImageData as CanvasImageData } from 'canvas';

interface ExtendedCanvas extends Canvas {
    captureStream(frameRate?: number): MediaStream;
    toBlob(callback: BlobCallback, type?: string, quality?: any): void;
    transferControlToOffscreen(): OffscreenCanvas;
    addEventListener: HTMLElement['addEventListener'];
    removeEventListener: HTMLElement['removeEventListener'];
    accessKey: HTMLElement['accessKey'];
    accessKeyLabel: HTMLElement['accessKeyLabel'];
}

interface ExtendedImage extends Image {
    align: string;
    alt: string;
    border: string;
    crossOrigin: string | null;
    currentSrc: string;
    decoding: string;
    fetchPriority: string;
    hspace: number;
}

interface ExtendedImageData extends CanvasImageData {
    prototype: ImageData;
}

declare global {
    type HTMLCanvasElement = ExtendedCanvas;
    type HTMLImageElement = ExtendedImage;
    type ImageData = ExtendedImageData;
}
