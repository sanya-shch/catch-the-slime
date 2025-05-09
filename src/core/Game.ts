import { Application, Ticker, Assets, Sprite } from "pixi.js";
import { LevelManager } from "../managers/LevelManager";
import { UIManager } from "../managers/UIManager";
import { SoundManager } from "../managers/SoundManager";
import { AssetManager } from "../managers/AssetManager";
import { BOOSTER_TIME, STAR_2_THRESHOLD, STAR_3_THRESHOLD } from "./constants";

export class Game {
  private levelManager: LevelManager;
  private uiManager: UIManager;
  private assetManager: AssetManager;
  private enemyKilledCount = 0;
  private totalEnemies = 0;
  private levelTimeLimit = 0;
  private isPaused = false;
  private remainingTime = 0;
  private lastUpdateTime = 0;
  private currentLevel = 1;
  private maxLevel = 3;
  private boosterUsed = false;

  constructor(private app: Application, private soundManager: SoundManager) {
    this.assetManager = new AssetManager();
    this.levelManager = new LevelManager(
      this.app.stage,
      this.assetManager,
      this.onEnemyKilled
    );
    this.uiManager = new UIManager(
      this.startGame.bind(this),
      this.togglePause,
      this.loadNextLevel,
      this.retryGame,
      this.useBooster,
      () => this.soundManager.toggleMute()
    );

    this.init();
  }

  private async init() {
    await this.loadBackground();
    await this.assetManager.load();
  }

  private async startGame(levelNumber = this.currentLevel) {
    this.enemyKilledCount = 0;

    const response = await fetch(`assets/levels/level${levelNumber}.json`);
    const levelData = await response.json();

    this.totalEnemies = levelData.enemies.length;
    this.levelTimeLimit = levelData.timeLimit;

    this.remainingTime = levelData.timeLimit;
    this.lastUpdateTime = performance.now();

    this.soundManager.playBg();

    this.levelManager.loadLevel(levelData);

    this.uiManager.updateEnemyCounter(this.enemyKilledCount, this.totalEnemies);

    this.boosterUsed = false;

    this.uiManager.showGameUI();

    this.app.ticker.add(this.update);
    this.app.ticker.start();
  }

  private togglePause = () => {
    this.isPaused = !this.isPaused;
    this.uiManager.togglePauseText(this.isPaused);

    if (this.isPaused) {
      this.app.ticker.remove(this.update);
      this.levelManager.deactivateEnemies();
    } else {
      this.lastUpdateTime = performance.now();
      this.app.ticker.add(this.update);
      this.levelManager.activateEnemies();
    }
  };

  private update = ({ deltaMS }: Ticker) => {
    if (this.isPaused) return;

    const now = performance.now();
    const deltaSeconds = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    this.remainingTime -= deltaSeconds;

    this.updateProgressBar();

    if (this.remainingTime <= 0) {
      this.remainingTime = 0;
      this.app.ticker.stop();
      this.endGame(false);
      return;
    }

    this.levelManager.update(deltaMS);
  };

  private onEnemyKilled = () => {
    this.soundManager.playKill();
    this.enemyKilledCount++;

    this.uiManager.updateEnemyCounter(this.enemyKilledCount, this.totalEnemies);

    if (this.enemyKilledCount >= this.totalEnemies) {
      this.endGame(true);

      setTimeout(() => {
        this.app.ticker.stop();
      }, 1000);
    }
  };

  private endGame = (win: boolean) => {
    this.levelManager.deactivateEnemies();
    this.soundManager.stopBg();

    this.uiManager.hideGameUI();

    if (win) {
      const timeUsed = this.levelTimeLimit - this.remainingTime;
      let stars = 1;
      if (timeUsed < this.levelTimeLimit * STAR_2_THRESHOLD) stars = 2;
      if (timeUsed < this.levelTimeLimit * STAR_3_THRESHOLD) stars = 3;

      this.uiManager.showWinScreen(stars);
      this.soundManager.playWin();
    } else {
      this.uiManager.showLoseScreen();
      this.soundManager.playLose();
    }
  };

  private loadNextLevel = () => {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
    }

    this.levelManager.clearLevel();
    this.uiManager.hideWinScreen();
    this.startGame(this.currentLevel);
  };

  private retryGame = () => {
    this.levelManager.clearLevel();
    this.uiManager.hideLoseScreen();
    this.startGame(this.currentLevel);
  };

  private async loadBackground() {
    Assets.add({ alias: "bg", src: "assets/background.jpg" });
    const texture = await Assets.load("bg");

    const bg = new Sprite(texture);
    bg.width = this.app.screen.width;
    bg.height = this.app.screen.height;

    this.app.stage.addChildAt(bg, 0);
  }

  private useBooster = () => {
    if (this.boosterUsed) return;

    this.boosterUsed = true;
    this.remainingTime += BOOSTER_TIME;
    if (this.remainingTime > this.levelTimeLimit) {
      this.remainingTime = this.levelTimeLimit;
    }

    this.updateProgressBar();
  };

  private updateProgressBar() {
    const progress = this.remainingTime / this.levelTimeLimit;
    this.uiManager.updateTimeProgress(progress);
  }
}
