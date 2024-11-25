import type { ImageProvider } from "../image/ImageProvider";
import type { DetectedFaceProvider } from "./DetectedFaceProvider";
import * as tf from "@tensorflow/tfjs-node";
import * as blazeface from "@tensorflow-models/blazeface";
import * as fs from "fs";
import * as path from "path";

export class TensorFlowDetectedFaceProvider implements DetectedFaceProvider {
  private model: blazeface.BlazeFaceModel | null = null;
  private landmarks: number[][][] = [];

  constructor(private readonly imageProvider: ImageProvider) {}

  async execute(buffer: Buffer, fileName: string): Promise<void> {
    if (!this.model) await this.loadModel();
    const image = await this.imageProvider.readImage(buffer);
    const tensor = tf.tensor3d(image.data, [image.height, image.width, 3]);

    const predictions = await this.model?.estimateFaces(tensor, false);

    if (predictions && predictions.length > 0) {
      predictions.forEach((prediction, index) => {
        const personFolder = `outputs/pessoa_${index + 1}`;
        this.createFolderIfNotExists(personFolder);
        this.copyImageToFolder(buffer, fileName, personFolder);

        // Adicione aqui qualquer processamento adicional que você queira fazer com as predições
        this.landmarks.push(prediction.landmarks as number[][]);
      });
    } else {
      console.log(`Nenhum rosto detectado na imagem ${fileName}`);
    }

    console.log(this.landmarks);

    tf.dispose();
  }

  private async loadModel() {
    this.model = await blazeface.load();
  }

  private createFolderIfNotExists(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  private copyImageToFolder(
    buffer: Buffer,
    fileName: string,
    folderPath: string
  ) {
    const destPath = path.join(folderPath, fileName);
    fs.writeFileSync(destPath, buffer);
  }
}
