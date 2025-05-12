import type { Enemy } from "./Enemy";

export interface IEnemyBehavior {
  onClick(enemy: Enemy): void;
}

export class EnemyBehavior implements IEnemyBehavior {
  constructor(
    private shouldKill: (enemy: Enemy) => boolean,
    private onKilledCallback: () => void,
    private onWrongColorClick?: () => void
  ) {}

  onClick = (enemy: Enemy) => {
    if (this.shouldKill(enemy)) {
      enemy.kill();
      this.onKilledCallback();
    } else {
      this.onWrongColorClick?.();
    }
  };
}
