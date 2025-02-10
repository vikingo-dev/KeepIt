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

  // Ajustar saturación y luminosidad a valores más equilibrados
  s = 85;  // Aumenta la saturación
  l = 75;  // Baja la luminosidad para evitar que sea tan claro

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const getDarkerColor = (hslColor: string, darknessFactor: number = 0.5) => {
  // Extraer los valores de H, S y L del string HSL
  const hslRegex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
  const match = hslColor.match(hslRegex);

  if (!match) {
    // Si el formato no es válido, devolver un gris por defecto
    return "hsl(0, 0%, 50%)";
  }

  // Extraer H, S y L
  const h = parseInt(match[1]); // Hue (0-360)
  const s = parseFloat(match[2]); // Saturación (0-100)
  let l = parseFloat(match[3]); // Luminosidad (0-100)

  // Ajustar la luminosidad usando el darknessFactor
  l = Math.max(l * darknessFactor, 0); // Reducir la luminosidad, mínimo 0%

  // Devolver el nuevo color en formato HSL
  return `hsl(${h}, ${s}%, ${l}%)`;
};
