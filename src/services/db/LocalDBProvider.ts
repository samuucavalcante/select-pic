import type { DBProvider } from "./DBProvider";
import fs from "fs";

export class LocalDBProvider implements DBProvider {
  private readonly dbPath = "./outputs";

  async save(userId: string, content: Buffer, type: string): Promise<void> {
    const writeStream = fs.createWriteStream(
      `${this.dbPath}/${userId}.${type}`
    );
    writeStream.write(content);
    writeStream.end();
  }
}
