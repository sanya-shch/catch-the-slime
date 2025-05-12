import type { Color } from "../types";

export function getColorByName(color: Color): string {
  return {
    red: "#ffcccc",
    green: "#ccffe4",
    blue: "#cce6ff",
  }[color];
}
