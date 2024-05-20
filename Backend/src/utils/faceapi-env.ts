import * as faceapi from 'face-api.js';
import { Canvas, Image } from 'canvas';
import { CustomImageData } from '../types/custom-imagedata';

interface ExtendedCanvas extends Canvas {
    captureStream(frameRate?: number): MediaStream;
    toBlob(callback: BlobCallback, type?: string, quality?: any): void;
    transferControlToOffscreen(): OffscreenCanvas;
    addEventListener: HTMLElement['addEventListener'];
    removeEventListener: HTMLElement['removeEventListener'];
    accessKey: HTMLElement['accessKey'];
    accessKeyLabel: HTMLElement['accessKeyLabel'];
    prototype: HTMLCanvasElement;
    new(): HTMLCanvasElement;
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
    prototype: HTMLImageElement;
    new(): HTMLImageElement;
}

// Use the custom ImageData class
interface ExtendedImageData extends CustomImageData {
    new(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    new(data: Uint8ClampedArray, sw: number, sh?: number, settings?: ImageDataSettings): ImageData;
    colorSpace: PredefinedColorSpace;
    prototype: ImageData;
}

export function monkeyPatchFaceAPI() {
    faceapi.env.monkeyPatch({
        Canvas: Canvas as unknown as { new(): HTMLCanvasElement; prototype: HTMLCanvasElement; },
        Image: Image as unknown as { new(): HTMLImageElement; prototype: HTMLImageElement; },
        ImageData: CustomImageData as unknown as { new(sw: number, sh: number, settings?: ImageDataSettings): ImageData; new(data: Uint8ClampedArray, sw: number, sh?: number, settings?: ImageDataSettings): ImageData; prototype: ImageData; }
    });
}
