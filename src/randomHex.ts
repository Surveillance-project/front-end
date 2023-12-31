export const getRandomHexColor = () => {
  // Generate a random number between 0 and 16777215 (0xFFFFFF in hexadecimal)
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Ensure the color has six digits by padding with zeros if necessary
  const hexColor = "000000".slice(0, 6 - randomColor.length) + randomColor;

  return `#${hexColor}`;
};
