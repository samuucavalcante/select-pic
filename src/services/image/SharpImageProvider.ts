import sharp from "sharp";
import type { ImageProvider } from "./ImageProvider";

export class SharpImageProvider implements ImageProvider {
  async readImage(path: Buffer): Promise<{
    data: Uint8Array<ArrayBuffer>;
    width: number;
    height: number;
  }> {
    const { data, info } = await sharp(path)
      .removeAlpha() // Remova o canal alfa para garantir 3 canais (RGB)
      .raw()
      .toBuffer({ resolveWithObject: true });

    return {
      data: new Uint8Array(data),
      height: info.height,
      width: info.width,
    };
  }
}
