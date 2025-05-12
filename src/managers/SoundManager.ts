import { Howl, Howler } from "howler";

export class SoundManager {
  private bgSound: Howl;
  private killSound: Howl;
  private winSound: Howl;
  private loseSound: Howl;
  private isMuted = false;

  constructor() {
    this.bgSound = new Howl({
      src: ["assets/sounds/bg.mp3"],
      loop: true,
      volume: 0.5,
    });
    this.killSound = new Howl({ src: ["assets/sounds/kill.mp3"] });
    this.winSound = new Howl({ src: ["assets/sounds/win.mp3"] });
    this.loseSound = new Howl({ src: ["assets/sounds/lose.mp3"] });
  }

  public playBg = () => {
    if (this.killSound.playing()) this.killSound.stop();
    if (this.winSound.playing()) this.winSound.stop();
    if (this.loseSound.playing()) this.loseSound.stop();

    if (!this.bgSound.playing()) this.bgSound.play();
  };

  public stopBg = () => {
    this.bgSound.stop();
  };

  public playKill = () => {
    this.killSound.play();
  };

  public playWin = () => {
    this.winSound.play();
  };

  public playLose = () => {
    this.loseSound.play();
  };

  public toggleMute = () => {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    return this.isMuted;
  };
}
