import { STAR_2_THRESHOLD, STAR_3_THRESHOLD } from "../core/constants";

export class UIManager {
  private pauseButton: HTMLButtonElement;
  private winScreen: HTMLDivElement;
  private loseScreen: HTMLDivElement;
  private starContainer: HTMLDivElement;
  private timeBar: HTMLDivElement;
  private enemyCounter: HTMLDivElement;
  private boosterButton: HTMLButtonElement;
  private buttonsContainer: HTMLDivElement;

  constructor(
    onStart: () => void,
    onPauseToggle: () => void,
    onNextLevel: () => void,
    onRetryGame: () => void,
    onBoosterClick: () => void,
    toggleMute: () => boolean
  ) {
    this.showStartButton(onStart);

    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.style.position = "absolute";
    this.buttonsContainer.style.top = "14px";
    this.buttonsContainer.style.right = "10px";
    this.buttonsContainer.style.display = "flex";
    this.buttonsContainer.style.flexDirection = "column";
    this.buttonsContainer.style.alignItems = "end";
    this.buttonsContainer.style.rowGap = "4px";
    document.body.appendChild(this.buttonsContainer);

    this.createMuteButton(toggleMute);
    this.pauseButton = this.createPauseButton(onPauseToggle);
    this.boosterButton = this.createBoosterButton(onBoosterClick);

    this.timeBar = this.createTimeBar();
    this.enemyCounter = this.createEnemyCounter();

    this.winScreen = this.createEndScreen(
      "🏆 You Win!",
      "➡️ Next Level",
      onNextLevel
    );
    this.starContainer = document.createElement("div");
    this.starContainer.style.fontSize = "36px";
    this.starContainer.style.marginBottom = "20px";
    this.winScreen.insertBefore(this.starContainer, this.winScreen.children[1]);

    this.loseScreen = this.createEndScreen(
      "💀 You Lose",
      "🔄 Retry",
      onRetryGame
    );
  }

  private createButton({
    label,
    style,
    onClick,
  }: {
    label: string;
    style?: Partial<CSSStyleDeclaration>;
    onClick: () => void;
  }): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = label;

    const baseButtonStyles = {
      outline: "none",
      cursor: "pointer",
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "13px 23px",
      border: "1px solid #222",
      transition: "box-shadow 0.2s ease 0s, transform 0.1s ease 0s",
      background: "#fff",
      color: "#222",
      zIndex: "100",
    };

    Object.assign(button.style, baseButtonStyles, style);

    button.addEventListener("mouseover", () => {
      button.style.background = "#f7f7f7";
      button.style.borderColor = "#000";
    });

    button.addEventListener("mouseout", () => {
      button.style.background = "#fff";
      button.style.borderColor = "#222";
    });

    button.addEventListener("click", onClick);

    return button;
  }

  private showStartButton(onClick: () => void) {
    const startButton = this.createButton({
      label: "🎮 Start Game",
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px 40px",
      },
      onClick: () => {
        startButton.remove();
        onClick();
      },
    });

    document.body.appendChild(startButton);
  }

  private createMuteButton(onToggle: () => boolean) {
    const muteButton = this.createButton({
      label: "🔊",
      onClick: () => {
        const muted = onToggle();
        muteButton.innerText = muted ? "🔇" : "🔊";
      },
    });

    this.buttonsContainer.appendChild(muteButton);
  }

  private createPauseButton(onClick: () => void): HTMLButtonElement {
    const button = this.createButton({
      label: "⏸️ Pause",
      style: {
        display: "none",
      },
      onClick,
    });

    this.buttonsContainer.appendChild(button);

    return button;
  }

  togglePauseText(paused: boolean) {
    this.pauseButton.textContent = paused ? "▶️ Resume" : "⏸️ Pause";
  }

  private createBoosterButton(onClick: () => void): HTMLButtonElement {
    const button = this.createButton({
      label: "⚡ +15s",
      style: {
        display: "none",
      },
      onClick: () => {
        onClick();
        this.boosterButton.disabled = true;
        this.boosterButton.style.opacity = "0.5";
      },
    });

    this.buttonsContainer.appendChild(button);

    return button;
  }

  private createTimeBar(): HTMLDivElement {
    const bar = document.createElement("div");

    Object.assign(bar.style, {
      position: "absolute",
      top: "0",
      left: "0",
      height: "10px",
      width: "100%",
      background: "#0f0",
      transition: "width 0.1s linear",
      display: "none",
    });

    document.body.appendChild(bar);

    return bar;
  }

  public updateTimeProgress(progress: number) {
    const clamped = Math.max(0, Math.min(1, progress));
    this.timeBar.style.width = `${clamped * 100}%`;

    if (clamped > STAR_2_THRESHOLD) {
      this.timeBar.style.background = "#28CC75";
    } else if (clamped > STAR_3_THRESHOLD) {
      this.timeBar.style.background = "#FEEE7D";
    } else {
      this.timeBar.style.background = "#FF6768";
    }
  }

  private createEnemyCounter(): HTMLDivElement {
    const counter = document.createElement("div");

    Object.assign(counter.style, {
      position: "absolute",
      top: "14px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "white",
      fontFamily: "Arial",
      zIndex: "100",
      background: "#000a",
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "5px 23px",
      display: "none",
    });

    document.body.appendChild(counter);

    return counter;
  }

  public updateEnemyCounter(killed: number, total: number) {
    this.enemyCounter.textContent = `Enemies: ${killed} / ${total}`;
  }

  private createEndScreen(
    title: string,
    buttonText: string,
    onClick: () => void
  ): HTMLDivElement {
    const container = document.createElement("div");

    Object.assign(container.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#000a",
      padding: "40px",
      color: "white",
      textAlign: "center",
      borderRadius: "20px",
      display: "none",
      zIndex: "100",
      fontFamily: "Arial",
      fontSize: "16px",
      lineHeight: "20px",
      fontWeight: "600",
    });

    const titleElem = document.createElement("h2");
    titleElem.textContent = title;
    titleElem.style.fontSize = "32px";
    titleElem.style.marginBottom = "40px";

    const button = this.createButton({
      label: buttonText,
      style: {
        padding: "10px 20px",
        fontSize: "18px",
        cursor: "pointer",
        marginTop: "20px",
      },
      onClick,
    });

    container.appendChild(titleElem);
    container.appendChild(button);
    document.body.appendChild(container);

    return container;
  }

  public showWinScreen(stars: number) {
    this.starContainer.innerHTML = "⭐".repeat(stars) + "💥".repeat(3 - stars);
    this.winScreen.style.display = "block";
  }

  public showLoseScreen() {
    this.loseScreen.style.display = "block";
  }

  public hideWinScreen() {
    this.winScreen.style.display = "none";
  }

  public hideLoseScreen() {
    this.loseScreen.style.display = "none";
  }

  public showGameUI() {
    this.pauseButton.style.display = "block";

    this.boosterButton.disabled = false;
    Object.assign(this.boosterButton.style, {
      display: "block",
      opacity: "1",
    });

    this.timeBar.style.display = "block";

    this.enemyCounter.style.display = "block";
  }

  public hideGameUI() {
    this.pauseButton.style.display = "none";

    this.boosterButton.disabled = false;
    Object.assign(this.boosterButton.style, {
      display: "none",
      opacity: "1",
    });

    this.timeBar.style.display = "none";

    this.enemyCounter.style.display = "none";
  }
}
