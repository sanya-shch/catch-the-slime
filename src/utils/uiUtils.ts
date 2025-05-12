import { type Application, Assets, Sprite } from "pixi.js";
import type { Color } from "../types";
import { getColorByName } from "./colorUtils";

export function updateBodyBackground(color: Color) {
  document.body.style.backgroundColor = getColorByName(color);
}

export const loadBackground = async (app: Application) => {
  Assets.add({ alias: "bg", src: "assets/background.jpg" });
  const texture = await Assets.load("bg");

  const bg = new Sprite(texture);
  bg.width = app.screen.width;
  bg.height = app.screen.height;

  app.stage.addChildAt(bg, 0);
};
