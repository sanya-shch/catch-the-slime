import { Application } from "pixi.js";
import { Game } from "./core/Game";
import { SoundManager } from "./managers/SoundManager";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./core/constants";
import { AssetManager } from "./managers/AssetManager";
import { loadBackground } from "./utils/uiUtils";

(async () => {
  const app = new Application();

  await app.init({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 0xcfcfcf,
  });

  document.body.appendChild(app.canvas);

  const assetManager = new AssetManager();
  await assetManager.load();

  await loadBackground(app);

  const soundManager = new SoundManager();

  new Game(app, soundManager, assetManager);
})();
