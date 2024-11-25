export interface ImageProvider {
  readImage(path: Buffer): Promise<{
    data: Uint8Array<ArrayBuffer>;
    width: number;
    height: number;
  }>;
}
