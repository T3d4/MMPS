export class CustomImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor(sw: number, sh: number, settings?: ImageDataSettings);
    constructor(data: Uint8ClampedArray, sw: number, sh?: number, settings?: ImageDataSettings);
    constructor(arg1: any, arg2: any, arg3?: any, arg4?: any) {
        if (arg1 instanceof Uint8ClampedArray) {
            this.data = arg1;
            this.width = arg2;
            this.height = arg3 || 0;
        } else {
            const sw = arg1;
            const sh = arg2;
            this.data = new Uint8ClampedArray(sw * (arg3 || sh) * 4);
            this.width = sw;
            this.height = sh;
        }
    }
}
