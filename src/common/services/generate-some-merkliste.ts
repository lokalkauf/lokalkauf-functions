import * as admin from 'firebase-admin';
import * as os from "os";
import { OverlayOptions } from "sharp";
const mkdirp = require("mkdirp");
const path = require("path");
const sharp = require("sharp");

const width = 224;
const height = 224;
const logoPath = "Merklisten/Logos/lokalkauf-logo.jpg";
const logoPathBig = "Merklisten/Logos/lokalkauf-logo-big.jpg";

interface Dimensions {
  width: number;
  height: number;
}

interface Position {
  left: number;
  top: number;
}

async function extractImages(imagePaths: string[]): Promise<OverlayOptions[]> {
  const images: OverlayOptions[] = [];
  for (let i = 0; i < imagePaths.length; i++) {
    const imageDimension = await sharp(imagePaths[i])
      .metadata()
      .then((m: any) => {
        return { w: m.width, h: m.height };
      });

    if (imageDimension.w >= imageDimension.h) {
      let toCrop = Math.round((imageDimension.w - width) / 2) - 1;
      if (!toCrop) {
        toCrop = 0;
      }
      const position = await calculateImagePosition(imagePaths.length, i);
      await sharp(imagePaths[i])
        .extract({ left: toCrop, top: 0, width, height })
        .toBuffer()
        .then((data: any) => {
          images.push({ input: data, top: position.top, left: position.left });
        });
    } else {
      let toCrop = Math.round((imageDimension.h - height) / 2) - 1;
      if (!toCrop) {
        toCrop = 0;
      }
      const position = await calculateImagePosition(imagePaths.length, i);
      await sharp(imagePaths[i])
        .extract({ left: 0, top: toCrop, width, height })
        .toBuffer()
        .then((data: any) => {
          images.push({ input: data, top: position.top, left: position.left });
        });
    }
  }
  return images;
}

async function calculateImagePosition(imagesAtAll: number, currentImage: number): Promise<Position> {
  if (currentImage < 2) {
    return { left: currentImage * width, top: 0 };
  }

  if (currentImage === 2 && imagesAtAll === 3) {
    return { left: 0, top: height };
  }

  if (imagesAtAll > 3) {
    return { left: width * (currentImage % 3), top: height * Math.floor(currentImage / 3) };
  }

  return { top: 0, left: 0 };
}

function placeLokalkaufLogo(imagePaths: string[]): OverlayOptions {
  let top: number = 0;
  let left: number = 0;

  if (imagePaths.length === 2) {
    top = width * 2;
  }

  if (imagePaths.length % 3 === 0 && imagePaths.length >= 3) {
    top = height * Math.floor(imagePaths.length / 3) + 1;
  } else {
    top = height * Math.floor(imagePaths.length / 3);
  }

  left = width * (imagePaths.length === 3 ? 1 : imagePaths.length % 3 === 0 ? 0.5 : imagePaths.length % 3);

  const logo = imagePaths.length % 3 < 3 - 1 && imagePaths.length > 3 ? logoPathBig : logoPath;
  return { input: logo, top: top, left: left };
}

async function calculateBaseImageSize(imagePaths: string[]): Promise<Dimensions> {
  if (imagePaths.length > 1 && imagePaths.length < 3) {
    return { width: width * (imagePaths.length + 1), height: height };
  }
  if (imagePaths.length === 3) {
    return { width: width * 2, height: height * 2 };
  }
  return { width: width * 3, height: height * Math.ceil(imagePaths.length / 3) + (imagePaths.length % 3 === 0 ? height : 0) };
}

export async function imageBuilder(imagePaths: string[], merklisteid: string) {
  if (imagePaths.length === 0) {
    return new Promise((_, reject) =>
      reject("1. No image path provided " + merklisteid));
  }

  const bucket = admin.storage().bucket();
  const tempDir = os.tmpdir();

  const tempPaths: string[] = [];
  await Promise.all(imagePaths.map(
    async imagePath => {
      if (imagePath && imagePath.length > 1) {
        const remoteFile = bucket.file(imagePath);
        const originalFile = path.join(tempDir, imagePath);
        const tempLocalDir = path.dirname(originalFile);
        await mkdirp(tempLocalDir);
        await remoteFile.download({ destination: originalFile });
        tempPaths.push(originalFile);
      }
    }
  ));

  if (tempPaths.length === 0) {
    return new Promise((_, reject) =>
      reject("2. No image path provided" + merklisteid));
  }

  const lst: OverlayOptions[] = await extractImages(tempPaths);

  const logoOptions = placeLokalkaufLogo(imagePaths);
  if (logoOptions && logoOptions.input) {
    console.log("logoOptions ", logoOptions);
    const remoteFile = bucket.file(logoOptions.input.toString());
    const originalFile = path.join(tempDir, logoOptions.input.toString());
    const tempLocalDir = path.dirname(originalFile);
    await mkdirp(tempLocalDir);
    await remoteFile.download({ destination: originalFile });
    const newOptions = { ...logoOptions, input: originalFile };
    console.log("newOptions", newOptions);
    lst.push(newOptions);
  };

  const dimensions = await calculateBaseImageSize(tempPaths);
  const metadata = {
    contentType: 'image/jpg',
  };
  sharp({
    create: {
      width: dimensions.width,
      height: dimensions.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .jpeg()
    .composite(lst)
    .sharpen()
    .withMetadata()
    .jpeg({ quality: 90 })
    .toBuffer()
    .then((data: any, info: any) => {
      console.log(info);
      bucket.file(`Merklisten/${merklisteid}/preview.jpg`).save(data, metadata, (err) => { console.log(err) });
      return new Promise((succ, _) =>
        succ());
    })
    .catch((err: any) => {
      console.log(err);
      return new Promise((_, reject) =>
        reject(err));
    });
}
/*
imageBuilder(["./sources/a.jpg", "./sources/b.jpg"]);
imageBuilder(["./sources/a.jpg", "./sources/b.jpg", "./sources/c.jpg"]);
imageBuilder(["./sources/a.jpg", "./sources/b.jpg", "./sources/c.jpg", "./sources/d.jpg"]);
imageBuilder(["./sources/a.jpg", "./sources/b.jpg", "./sources/c.jpg", "./sources/d.jpg", "./sources/e.jpg"]);
imageBuilder(["./sources/a.jpg", "./sources/b.jpg", "./sources/c.jpg", "./sources/d.jpg", "./sources/e.jpg", "./sources/f.jpg"]);
imageBuilder(["./sources/a.jpg", "./sources/b.jpg", "./sources/c.jpg", "./sources/d.jpg", "./sources/e.jpg", "./sources/f.jpg", "./sources/g.jpg"]);
imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
]);
imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
]);
imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
]);

imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
  "./sources/k.jpg",
]);

imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
  "./sources/k.jpg",
  "./sources/l.jpg",
]);

imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
  "./sources/k.jpg",
  "./sources/l.jpg",
  "./sources/m.jpg",
]);

imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
  "./sources/k.jpg",
  "./sources/l.jpg",
  "./sources/m.jpg",
  "./sources/n.jpg",
]);

imageBuilder([
  "./sources/a.jpg",
  "./sources/b.jpg",
  "./sources/c.jpg",
  "./sources/d.jpg",
  "./sources/e.jpg",
  "./sources/f.jpg",
  "./sources/g.jpg",
  "./sources/h.jpg",
  "./sources/i.jpg",
  "./sources/j.jpg",
  "./sources/k.jpg",
  "./sources/l.jpg",
  "./sources/m.jpg",
  "./sources/n.jpg",
  "./sources/o.jpg",
]);
*/
