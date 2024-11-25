import fs from "fs";
import path from "path";

export class FileSystem {
  getImages(folderPath: string): [Buffer, string][] {
    const images = fs.readdirSync(folderPath);
    return images.map((image) => {
      const readSync = fs.readFileSync(path.resolve(folderPath, image));
      return [readSync, image];
    });
  }
}
