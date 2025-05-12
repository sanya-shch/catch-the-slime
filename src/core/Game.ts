import { type Application, Ticker } from "pixi.js";
import { LevelManager } from "../managers/LevelManager";
import { UIManager } from "../managers/UIManager";
import type { AssetManager } from "../managers/AssetManager";
import { BOOSTER_TIME, STAR_2_THRESHOLD, STAR_3_THRESHOLD } from "./constants";
import { updateBodyBackground } from "../utils/uiUtils";
import type { SoundManager } from "../managers/SoundManager";
import type { Enemy } from "../entities/Enemy";
import { type Color, GameMode } from "../types";

export class Game {
  private levelManager: LevelManager;
  private uiManager: UIManager;
  private enemyKilledCount = 0;
  private totalEnemies = 0;
  private levelTimeLimit = 0;
  private isPaused = false;
  private remainingTime = 0;
  private lastUpdateTime = 0;
  private currentLevel = 1;
  private maxLevel = 3;
  private boosterUsed = false;
  private gameMode: GameMode = GameMode.hard;
  private gameColor: Color = "green";
  private colorTimer = 0;

  constructor(
    private app: Application,
    private soundManager: SoundManager,
    assetManager: AssetManager
  ) {
    this.levelManager = new LevelManager(
      this.app.stage,
      assetManager,
      this.shouldKill,
      this.onEnemyKilled,
      this.onWrongColorClick
    );
    this.uiManager = new UIManager(
      this.onClickStartGame,
      this.togglePause,
      this.loadNextLevel,
      this.retryGame,
      this.useBooster,
      this.soundManager.toggleMute
    );
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

    this.levelManager.loadLevel(levelData, this.gameMode);

    this.uiManager.updateEnemyCounter(this.enemyKilledCount, this.totalEnemies);

    this.boosterUsed = false;

    this.uiManager.showGameUI(this.gameMode);

    if (this.gameMode === GameMode.hard) {
      updateBodyBackground(this.gameColor);
    }

    this.app.ticker.add(this.update);
  }

  private onClickStartGame = (gameMode: GameMode) => {
    this.gameMode = gameMode;

    this.startGame();
  };

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

    if (this.gameMode === GameMode.hard) {
      this.colorTimer += deltaMS;

      this.updateColorChangeProgressBar();

      if (this.colorTimer >= 3000) {
        this.colorTimer = 0;

        const existingColors = Array.from(
          new Set(
            this.levelManager
              .getEnemies()
              .reduce<Color[]>(
                (acc, enemy) =>
                  !enemy.getIsDead() ? [...acc, enemy.getColor()] : acc,
                []
              )
          )
        );

        const newColor =
          existingColors[Math.floor(Math.random() * existingColors.length)];
        this.gameColor = newColor;

        updateBodyBackground(newColor);
      }
    }

    const now = performance.now();
    const deltaSeconds = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    this.remainingTime -= deltaSeconds;

    this.updateProgressBar();

    if (this.remainingTime <= 0) {
      this.remainingTime = 0;
      this.app.ticker.remove(this.update);
      this.endGame(false);
      return;
    }

    this.levelManager.update(deltaMS);
  };

  private shouldKill = (enemy: Enemy) => {
    return (
      this.gameMode === GameMode.normal || enemy.getColor() === this.gameColor
    );
  };

  private onWrongColorClick = () => {
    this.remainingTime = Math.max(0, this.remainingTime - 5);
  };

  private onEnemyKilled = () => {
    this.soundManager.playKill();
    this.enemyKilledCount++;

    this.uiManager.updateEnemyCounter(this.enemyKilledCount, this.totalEnemies);

    if (this.enemyKilledCount >= this.totalEnemies) {
      this.endGame(true);

      setTimeout(() => {
        this.app.ticker.remove(this.update);
      }, 1000);
    }
  };

  private endGame = (win: boolean) => {
    this.levelManager.deactivateEnemies();
    this.soundManager.stopBg();

    this.uiManager.hideGameUI(this.gameMode);

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

  private updateColorChangeProgressBar() {
    const progress = this.colorTimer / 3000;
    this.uiManager.updateColorChangeProgress(progress, this.gameColor);
  }
}
