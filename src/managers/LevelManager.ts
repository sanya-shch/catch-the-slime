import { Container } from "pixi.js";
import { Enemy } from "../entities/Enemy";
import { EnemyAssets } from "../entities/EnemyAssets";
import { EnemyBehavior } from "../entities/EnemyBehavior";
import { AssetManager } from "./AssetManager";
import { Color, GameMode } from "../types";

export interface EnemyConfig {
  x: number;
  y: number;
  speed: number;
  color: Color;
}

export interface LevelConfig {
  enemies: EnemyConfig[];
  timeLimit: number;
}

export class LevelManager {
  private enemies: Enemy[] = [];

  constructor(
    private container: Container,
    private assetManager: AssetManager,
    private shouldKill: (enemy: Enemy) => boolean,
    private onEnemyKilled: () => void,
    private onWrongColorClick?: () => void
  ) {
    this.container = container;
    this.assetManager = assetManager;
    this.onEnemyKilled = onEnemyKilled;
  }

  loadLevel = (levelData: LevelConfig, gameMode: GameMode): void => {
    const enemyAssets = new EnemyAssets(
      this.assetManager.getIdleTextures(),
      this.assetManager.getDeadTextures()
    );

    for (const config of levelData.enemies) {
      const enemyBehavior = new EnemyBehavior(
        this.shouldKill,
        this.onEnemyKilled,
        this.onWrongColorClick
      );

      const enemy = new Enemy(
        enemyAssets,
        config.x,
        config.y,
        gameMode === GameMode.normal ? "green" : config.color,
        config.speed,
        enemyBehavior
      );

      this.container.addChild(enemy.sprite);
      this.enemies.push(enemy);
    }
  };

  update = (delta: number) => {
    this.enemies.forEach((enemy) => {
      enemy.update(delta);
    });
  };

  clearLevel = () => {
    this.enemies.forEach((enemy) => {
      this.container.removeChild(enemy.sprite);
      this.container.removeChild(enemy.deadAnimation);
      enemy.destroy();
    });
    this.enemies = [];
  };

  deactivateEnemies = () => {
    this.enemies.forEach((enemy) => enemy.deactivate());
  };

  activateEnemies = () => {
    this.enemies.forEach((enemy) => enemy.activate());
  };

  getEnemies = () => {
    return this.enemies;
  };
}
