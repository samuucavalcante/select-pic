export interface DetectedFaceProvider {
  execute(input: Buffer, fileName: string): Promise<void>;
}
