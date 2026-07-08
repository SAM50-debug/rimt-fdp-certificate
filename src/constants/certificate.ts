export const CERTIFICATE = {
  PREVIEW_WIDTH: 874, // 1748 / 2
  PREVIEW_HEIGHT: 620, // 1240 / 2
  NAME_X: 205,
  NAME_Y: 460,
  NAME_SIZE: 32,
  NAME_COLOR: "#FF751F",

  QR_X: 160,
  QR_Y: 80,
  QR_SIZE: 95,

  SERIAL_SUFFIX_X: 830,
  SERIAL_SUFFIX_Y: 200,
  SERIAL_SUFFIX_SIZE: 10,
  SERIAL_SUFFIX_COLOR: "#2D5175",
  SERIAL_SUFFIX_ROTATION: 90,
};

export function extractSerialSuffix(serial: string): string {
  return String(serial).slice(-2);
}
