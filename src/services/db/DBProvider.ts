export interface DBProvider {
  save(userId: string, content: Buffer, type: string): Promise<void>;
}
