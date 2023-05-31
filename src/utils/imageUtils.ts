import { Action, FlipType, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import { deleteFile, readFileAsArrayBuffer } from './fileSystem';

export const getExifOrientation = async (filePath: string): Promise<number> => {
  let orientation = 0;

  const rawData = await readFileAsArrayBuffer(filePath);
  const dataView = new DataView(rawData);

  if (dataView.getUint16(0, false) === 0xFFD8) {
    const length = dataView.byteLength;
    let offset = 2;

    while (offset < length) {
      if (dataView.getUint16(offset + 2, false) <= 8) {
        break;
      }

      const marker = dataView.getUint16(offset, false);
      offset += 2;

      if (marker === 0xFFE1) {
        if (dataView.getUint32(offset += 2, false) !== 0x45786966) {
          break;
        }

        const isLittleEndian = dataView.getUint16(offset += 6, false) === 0x4949;
        offset += dataView.getUint32(offset + 4, isLittleEndian);

        const tags = dataView.getUint16(offset, isLittleEndian);
        offset += 2;

        for (let i = 0; i < tags; i++) {
          if (dataView.getUint16(offset + (i * 12), isLittleEndian) === 0x0112) {
            orientation = dataView.getUint16(offset + (i * 12) + 8, isLittleEndian);
            break;
          }
        }
      } else if ((marker & 0xFF00) !== 0xFF00) {
        break;
      } else {
        offset += dataView.getUint16(offset, false);
      }
    }
  }

  return orientation;
};

export const rotateImageIfNeeded = async (imagePath: string): Promise<string> => {
  const manipulations: Action[] = [];

  const exifOrientation = await getExifOrientation(imagePath);

  switch (exifOrientation) {
    case 2:
      manipulations.push({ flip: FlipType.Horizontal });
      break;

    case 3:
      manipulations.push({ rotate: 180 });
      break;

    case 4:
      manipulations.push({ rotate: 180 });
      manipulations.push({ flip: FlipType.Horizontal });
      break;

    case 5:
      manipulations.push({ rotate: -90 });
      manipulations.push({ flip: FlipType.Horizontal });
      break;

    case 6:
      manipulations.push({ rotate: -90 });
      break;

    case 7:
      manipulations.push({ rotate: 90 });
      manipulations.push({ flip: FlipType.Horizontal });
      break;

    case 8:
      manipulations.push({ rotate: 90 });
      break;

    default:
      break;
  }

  if (manipulations.length === 0) {
    return imagePath;
  } else {
    const rotated = await manipulateAsync(
      imagePath,
      manipulations,
      {
        base64: false,
        compress: 1.0,
        format: SaveFormat.JPEG,
      },
    );

    await deleteFile(imagePath);
    return rotated.uri;
  }
};
