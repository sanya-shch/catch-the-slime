import { AnimatedSprite, Texture } from "pixi.js";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../core/constants";

export class Enemy {
  public sprite: AnimatedSprite;
  public deadAnimation: AnimatedSprite;
  private isDead = false;
  private speed;
  private dx: number;
  private dy: number;
  private onKilled: () => void;

  constructor(
    idleSheet: Texture[],
    deadSheet: Texture[],
    x: number,
    y: number,
    speed: number,
    onKilled: () => void
  ) {
    this.sprite = new AnimatedSprite(idleSheet);
    this.sprite.animationSpeed = speed;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
    this.sprite.scale = 1.5;
    this.sprite.play();

    this.deadAnimation = new AnimatedSprite(deadSheet);
    this.deadAnimation.animationSpeed = 0.2;
    this.deadAnimation.loop = false;
    this.deadAnimation.visible = false;
    this.deadAnimation.scale = 1.5;

    this.speed = speed;

    const angle = Math.random() * Math.PI * 2;
    this.dx = Math.cos(angle) * this.speed;
    this.dy = Math.sin(angle) * this.speed;

    this.onKilled = onKilled;

    this.sprite.on("pointerdown", () => this.kill());
  }

  update(delta: number) {
    if (this.isDead) return;

    const newX = this.sprite.x + this.dx * delta;
    const newY = this.sprite.y + this.dy * delta;

    const w = this.sprite.width;
    const h = this.sprite.height;

    const maxX = SCREEN_WIDTH - w;
    const maxY = SCREEN_HEIGHT - h;

    if (newX < 0 || newX > maxX) {
      this.dx *= -1;
    }
    if (newY < 0 || newY > maxY) {
      this.dy *= -1;
    }

    this.sprite.x += this.dx * delta;
    this.sprite.y += this.dy * delta;

    this.sprite.zIndex = this.sprite.y;
  }

  kill() {
    if (this.isDead) return;
    this.isDead = true;

    this.deadAnimation.x = this.sprite.x;
    this.deadAnimation.y = this.sprite.y;

    this.sprite.visible = false;
    this.deadAnimation.visible = true;
    this.deadAnimation.play();

    this.sprite.parent?.addChild(this.deadAnimation);

    this.onKilled();

    setTimeout(() => {
      this.deadAnimation.visible = false;
    }, 600);
  }

  deactivate() {
    this.sprite.eventMode = "none";
    this.sprite.cursor = "auto";
  }

  activate() {
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
  }

  destroy() {
    this.sprite.destroy();
    this.deadAnimation.destroy();
  }
}
