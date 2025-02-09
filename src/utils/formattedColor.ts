export const pastelizeColorPastel = (hex: string) => {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Convertir a HSL
  let h, s, l;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // Gris
  } else {
    let d = max - min;
    s = l > 128 ? d / (510 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  // Ajustar saturación y luminosidad a valores pastel
  s = 40;
  l = 80;

  return `hsl(${h}, ${s}%, ${l}%)`;
};
