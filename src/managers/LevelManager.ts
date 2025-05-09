import { Container } from "pixi.js";
import { Enemy } from "../entities/Enemy";
import { AssetManager } from "./AssetManager";

export interface EnemyConfig {
  x: number;
  y: number;
  speed: number;
}

export interface LevelConfig {
  enemies: EnemyConfig[];
  timeLimit: number;
}

export class LevelManager {
  private container: Container;
  private enemies: Enemy[] = [];
  private onEnemyKilled: () => void;
  private assetManager: AssetManager;

  constructor(
    container: Container,
    assetManager: AssetManager,
    onEnemyKilled: () => void
  ) {
    this.container = container;
    this.assetManager = assetManager;
    this.onEnemyKilled = onEnemyKilled;
  }

  loadLevel(levelData: LevelConfig): void {
    const idleSheet = this.assetManager.getIdleTextures();
    const deadSheet = this.assetManager.getDeadTextures();

    for (const config of levelData.enemies) {
      const enemy = new Enemy(
        idleSheet,
        deadSheet,
        config.x,
        config.y,
        config.speed,
        this.onEnemyKilled
      );
      this.container.addChild(enemy.sprite);
      this.enemies.push(enemy);
    }
  }

  update(delta: number) {
    this.enemies.forEach((enemy) => enemy.update(delta));
  }

  clearLevel() {
    this.enemies.forEach((enemy) => {
      this.container.removeChild(enemy.sprite);
      this.container.removeChild(enemy.deadAnimation);
      enemy.destroy();
    });
    this.enemies = [];
  }

  deactivateEnemies() {
    this.enemies.forEach((enemy) => enemy.deactivate());
  }

  activateEnemies() {
    this.enemies.forEach((enemy) => enemy.activate());
  }
}
