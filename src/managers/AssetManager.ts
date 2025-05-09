import { Assets, Texture } from "pixi.js";

export class AssetManager {
  private idleSheet: Texture[] = [];
  private deadSheet: Texture[] = [];

  async load(): Promise<void> {
    Assets.add({ alias: "idle", src: "./assets/Idle.json" });
    Assets.add({ alias: "dead", src: "./assets/Dead.json" });

    await Assets.load(["idle", "dead"]);

    for (let i = 0; i < 8; i++) {
      this.idleSheet.push(Texture.from(`idle_${i}.png`));
    }
    for (let i = 0; i < 3; i++) {
      this.deadSheet.push(Texture.from(`dead_${i}.png`));
    }
  }

  getIdleTextures(): Texture[] {
    return this.idleSheet;
  }

  getDeadTextures(): Texture[] {
    return this.deadSheet;
  }
}
