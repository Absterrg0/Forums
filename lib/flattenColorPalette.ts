// utils/flattenColorPalette.ts

type ColorValue = string | { [key: string]: ColorValue };

function flattenColorPalette(colors: ColorValue, prefix: string = ''): Record<string, string> {
  let flattened: Record<string, string> = {};

  function recurse(colors: ColorValue, prefix: string) {
    if (typeof colors === 'string') {
      flattened[prefix] = colors;
    } else if (typeof colors === 'object') {
      for (const [key, value] of Object.entries(colors)) {
        recurse(value, prefix ? `${prefix}-${key}` : key);
      }
    }
  }

  recurse(colors, prefix);
  return flattened;
}

export default flattenColorPalette;
