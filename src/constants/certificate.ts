export const CERTIFICATE = {
  PREVIEW_WIDTH: 842,
  PREVIEW_HEIGHT: 595,
  NAME_X: 205,
  NAME_Y: 440,
  NAME_SIZE: 32,
  NAME_COLOR: "#FF751F",

  QR_X: 160,
  QR_Y: 80,
  QR_SIZE: 75,

  SERIAL_SUFFIX_X: 799,
  SERIAL_SUFFIX_Y: 195,
  SERIAL_SUFFIX_SIZE: 10,
  SERIAL_SUFFIX_COLOR: "#2D5175",
  SERIAL_SUFFIX_ROTATION: 90,
};

export function extractSerialSuffix(serial: string): string {
  return String(serial).slice(-2);
}
