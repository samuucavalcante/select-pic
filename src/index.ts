// import path from "path";
// import { TensorFlowDetectedFaceProvider } from "./services/detected-face/TensorFlowDetectedFaceProvider";
// import { SharpImageProvider } from "./services/image/SharpImageProvider";
// import { FileSystem } from "./utils/FileSystem";

// const imageProvider = new SharpImageProvider();
// const fileSystem = new FileSystem();
// const detectedFaceProvider = new TensorFlowDetectedFaceProvider(imageProvider);

// const folderPath = path.resolve(__dirname, "inputs");
// const images = fileSystem.getImages(folderPath);

// for (const [image, fileName] of images) {
//   const detectedFaces = await detectedFaceProvider.execute(image, fileName);
// }

import fs from "fs-extra";
import path from "path";
import axios from "axios";

// Sua chave de API do Google Vision
const API_KEY = "49683db4fa1da20139ab16e07c2331d202ea81c4";

// Função para identificar pessoas na foto usando a Google Vision API
async function identifyPeople(imagePath: string): Promise<string[]> {
  const image = fs.readFileSync(imagePath, { encoding: "base64" });

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
  const response = await axios.post(url, {
    requests: [
      {
        image: { content: image },
        features: [{ type: "LABEL_DETECTION" }],
      },
    ],
  });

  // Extraímos os rótulos da resposta da API, que podem incluir nomes de pessoas
  const labels = response.data.responses[0].labelAnnotations;
  return labels
    .filter((label: any) => label.description.toLowerCase().includes("person"))
    .map((label: any) => label.description);
}

// Função para organizar as fotos em pastas
async function organizePhotos(sourceDir: string) {
  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const filePath = path.join(sourceDir, file);

    if (fs.lstatSync(filePath).isFile()) {
      const people = await identifyPeople(filePath);

      for (const person of people) {
        const personDir = path.join(sourceDir, person);

        // Cria a pasta se não existir
        if (!fs.existsSync(personDir)) {
          await fs.mkdir(personDir);
        }

        // Move a foto para a pasta da pessoa
        const destPath = path.join(personDir, file);
        await fs.move(filePath, destPath);
        console.log(`Movendo ${file} para ${personDir}`);
      }
    }
  }
}

// Chama a função principal
const folderPath = path.resolve(__dirname, "inputs");
organizePhotos(folderPath).catch(console.error);
