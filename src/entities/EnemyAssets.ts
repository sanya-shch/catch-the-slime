import type { Texture } from "pixi.js";
import type { Color } from "../types";

export class EnemyAssets {
  constructor(
    private idleSheet: Record<Color, Texture[]>,
    private deadSheet: Record<Color, Texture[]>
  ) {}

  getIdleTextures = (color: Color): Texture[] => {
    return this.idleSheet[color];
  };

  getDeadTextures = (color: Color): Texture[] => {
    return this.deadSheet[color];
  };
}
