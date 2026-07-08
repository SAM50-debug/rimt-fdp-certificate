import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fs from 'fs';
import { CERTIFICATE } from './src/constants/certificate.js';
import fontkit from '@pdf-lib/fontkit';

async function test() {
  const templateBytes = fs.readFileSync('public/certificate-template.png'); // use the public one to match preview
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const templateImage = await pdfDoc.embedPng(templateBytes);
  const { width: imgW, height: imgH } = templateImage;
  const page = pdfDoc.addPage([imgW, imgH]);
  page.drawImage(templateImage, { x: 0, y: 0, width: imgW, height: imgH });

  const nameFontBytes = fs.readFileSync('src/assets/fonts/CanvaSans-Bold.otf');
  const nameFont = await pdfDoc.embedFont(nameFontBytes);
  const serialFontBytes = fs.readFileSync('src/assets/fonts/TTSquares-Bold.ttf');
  const serialFont = await pdfDoc.embedFont(serialFontBytes);

  const scaleX = imgW / CERTIFICATE.PREVIEW_WIDTH;
  const scaleY = imgH / CERTIFICATE.PREVIEW_HEIGHT;

  const pdfNameSize = CERTIFICATE.NAME_SIZE * scaleY;
  const pdfNameX = CERTIFICATE.NAME_X * scaleX;
  const pdfNameY = CERTIFICATE.NAME_Y * scaleY;

  const name = "RAVINDER PAL SINGH";
  const nameWidth = nameFont.widthOfTextAtSize(name, pdfNameSize);
  const nameX = pdfNameX - nameWidth / 2;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nameFontKit = (nameFont as any).embedder?.font;
  const nameDescent = nameFontKit ? (nameFontKit.descent / nameFontKit.unitsPerEm) * pdfNameSize : 0;

  page.drawText(name, {
    x: nameX,
    y: pdfNameY - nameDescent,
    size: pdfNameSize,
    font: nameFont,
    color: rgb(1, 0.46, 0.12),
  });

  const pdfSerialSize = CERTIFICATE.SERIAL_SUFFIX_SIZE * scaleY;
  const pdfSerialX = CERTIFICATE.SERIAL_SUFFIX_X * scaleX;
  const pdfSerialY = CERTIFICATE.SERIAL_SUFFIX_Y * scaleY;

  page.drawText("01", {
    x: pdfSerialX,
    y: pdfSerialY,
    size: pdfSerialSize,
    font: serialFont,
    color: rgb(0.17, 0.32, 0.46),
    rotate: degrees(-CERTIFICATE.SERIAL_SUFFIX_ROTATION),
  });

  fs.writeFileSync('test_output.pdf', await pdfDoc.save());
  console.log('PDF generated at test_output.pdf');
}
test();
