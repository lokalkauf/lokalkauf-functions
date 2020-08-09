import * as fs from "fs";
import UUID from "pure-uuid";
import { OverlayOptions } from "sharp";
const mkdirp = require("mkdirp");
const path = require("path");
const sharp = require("sharp");

const width = 224;
const height = 224;
const logoPath = "./sources/lokalkauf-logo.jpg";
const logoPathBig = "./sources/lokalkauf-logo-big.jpg";

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

export async function imageBuilder(imagePaths: string[]): Promise<boolean> {
  if (imagePaths.length === 0) {
    return false;
  }

  const tempLocalDir = path.join(".", imagePaths.length + "-" + new UUID(4).format());
  await mkdirp(tempLocalDir);
  if (await fs.existsSync(tempLocalDir)) {
    const lst: OverlayOptions[] = await extractImages(imagePaths);

    lst.push(placeLokalkaufLogo(imagePaths));

    const dimensions = await calculateBaseImageSize(imagePaths);

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
      .toFile(tempLocalDir + "/desti-" + imagePaths.length + ".jpg")
      .then((info: any) => {
        console.log(info);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  return true;
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
