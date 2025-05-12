import { Assets, Texture } from "pixi.js";
import type { Color } from "../types";

export class AssetManager {
  private idleSheet: Texture[] = [];
  private deadSheet: Texture[] = [];
  private redIdleSheet: Texture[] = [];
  private blueIdleSheet: Texture[] = [];
  private redDeadSheet: Texture[] = [];
  private blueDeadSheet: Texture[] = [];

  async load(): Promise<void> {
    Assets.add({ alias: "idle", src: "./assets/Idle.json" });
    Assets.add({ alias: "dead", src: "./assets/Dead.json" });
    Assets.add({ alias: "redIdle", src: "./assets/RedIdle.json" });
    Assets.add({ alias: "blueIdle", src: "./assets/BlueIdle.json" });
    Assets.add({ alias: "redDead", src: "./assets/RedDead.json" });
    Assets.add({ alias: "blueDead", src: "./assets/BlueDead.json" });

    await Assets.load([
      "idle",
      "dead",
      "redIdle",
      "blueIdle",
      "redDead",
      "blueDead",
    ]);

    for (let i = 0; i < 8; i++) {
      this.idleSheet.push(Texture.from(`idle_${i}.png`));
      this.redIdleSheet.push(Texture.from(`redIdle_${i}.png`));
      this.blueIdleSheet.push(Texture.from(`blueIdle_${i}.png`));
    }
    for (let i = 0; i < 3; i++) {
      this.deadSheet.push(Texture.from(`dead_${i}.png`));
      this.redDeadSheet.push(Texture.from(`redDead_${i}.png`));
      this.blueDeadSheet.push(Texture.from(`blueDead_${i}.png`));
    }
  }

  getIdleTextures = (): Record<Color, Texture[]> => {
    return {
      green: this.idleSheet,
      red: this.redIdleSheet,
      blue: this.blueIdleSheet,
    };
  };

  getDeadTextures = (): Record<Color, Texture[]> => {
    return {
      green: this.deadSheet,
      red: this.redDeadSheet,
      blue: this.blueDeadSheet,
    };
  };
}
