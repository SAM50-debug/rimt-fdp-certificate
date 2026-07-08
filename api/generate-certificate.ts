import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import path from 'node:path';
import fs from 'node:fs';
import { findEmployee } from './lib/faculty.js';
import { CERTIFICATE, extractSerialSuffix } from '../src/constants/certificate.js';

const VERIFY_BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'https://fdprimt.vercel.app';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
}

function resolveAsset(...segments: string[]): Buffer {
  const filePath = path.join(process.cwd(), ...segments);
  return fs.readFileSync(filePath);
}

async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: 'png',
    width: 200,
    margin: 0,
    color: { dark: '#2D5175', light: '#FFFFFF' },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { employeeCode } = req.body as { employeeCode?: string };
  if (!employeeCode || !employeeCode.trim()) {
    return res.status(400).json({ error: 'Employee code is required' });
  }

  try {
    const employee = findEmployee(employeeCode);
    if (!employee) {
      return res.status(404).json({ error: 'Employee code not found.' });
    }

    const name = String(employee['Name']).toUpperCase();
    const serialNo = String(employee['Serial No']);
    const verifyUrl = `${VERIFY_BASE_URL}/verify/${serialNo}`;

    // Load assets
    const templateBytes = resolveAsset('assets', 'certificate', 'certificate-template.png');
    const nameFontBytes = resolveAsset('src', 'assets', 'fonts', 'CanvaSans-Bold.otf');
    const serialFontBytes = resolveAsset('src', 'assets', 'fonts', 'TTSquares-Bold.ttf');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Embed template
    const templateImage = await pdfDoc.embedPng(templateBytes);
    const { width: imgW, height: imgH } = templateImage;

    // Page matches template dimensions (pixels → points at 1:1)
    const page = pdfDoc.addPage([imgW, imgH]);
    page.drawImage(templateImage, { x: 0, y: 0, width: imgW, height: imgH });

    // Embed fonts
    const nameFont = await pdfDoc.embedFont(nameFontBytes);
    const serialFont = await pdfDoc.embedFont(serialFontBytes);

    // Calculate Scale Factors
    const scaleX = imgW / CERTIFICATE.PREVIEW_WIDTH;
    const scaleY = imgH / CERTIFICATE.PREVIEW_HEIGHT;

    // Draw participant name
    const pdfNameSize = CERTIFICATE.NAME_SIZE * scaleY;
    const pdfNameX = CERTIFICATE.NAME_X * scaleX;
    const pdfNameY = CERTIFICATE.NAME_Y * scaleY;

    const nameWidth = nameFont.widthOfTextAtSize(name, pdfNameSize);
    const nameX = pdfNameX - nameWidth / 2;

    // Calculate baseline compensation (descent is negative, so subtract to move baseline up)
    const nameFontKit = (nameFont as any).embedder?.font;
    const nameDescent = nameFontKit ? (nameFontKit.descent / nameFontKit.unitsPerEm) * pdfNameSize : 0;

    page.drawText(name, {
      x: nameX,
      y: pdfNameY - nameDescent,
      size: pdfNameSize,
      font: nameFont,
      color: hexToRgb(CERTIFICATE.NAME_COLOR),
    });

    // Draw serial number suffix
    const serialSuffix = extractSerialSuffix(serialNo);
    
    const pdfSerialSize = CERTIFICATE.SERIAL_SUFFIX_SIZE * scaleY;
    const pdfSerialX = CERTIFICATE.SERIAL_SUFFIX_X * scaleX;
    const pdfSerialY = CERTIFICATE.SERIAL_SUFFIX_Y * scaleY;

    // Baseline compensation for rotated text: 
    // PDF-lib pivots on the baseline start. CSS pivots on the bottom-left of the bounding box.
    // For -90 degree rotation, the baseline goes straight down. The descenders extend to the LEFT of the baseline.
    // To match CSS `left` boundary, we must shift the baseline RIGHT by the descender amount.
    const serialFontKit = (serialFont as any).embedder?.font;
    const serialDescent = serialFontKit ? (serialFontKit.descent / serialFontKit.unitsPerEm) * pdfSerialSize : 0;

    page.drawText(serialSuffix, {
      x: pdfSerialX - serialDescent, // Subtract negative descent = move right
      y: pdfSerialY, // CSS bottom edge perfectly aligns with the rotation start
      size: pdfSerialSize,
      font: serialFont,
      color: hexToRgb(CERTIFICATE.SERIAL_SUFFIX_COLOR),
      rotate: degrees(-CERTIFICATE.SERIAL_SUFFIX_ROTATION), // Negated because PDF-lib is CCW, CSS is CW
    });

    // Generate and embed QR code
    const qrPng = await generateQrPng(verifyUrl);
    const qrImage = await pdfDoc.embedPng(qrPng);
    const pdfQrSize = CERTIFICATE.QR_SIZE * scaleX;
    
    page.drawImage(qrImage, { 
      x: CERTIFICATE.QR_X * scaleX, 
      y: CERTIFICATE.QR_Y * scaleY, 
      width: pdfQrSize, 
      height: pdfQrSize 
    });

    // Serialize
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${serialNo}.pdf"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        console.error(err.stack);
      }

      return res.status(500).json({
        error: err instanceof Error ? err.message : "Unknown error"
    });
  }
}
