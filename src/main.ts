import Phaser from "phaser";
import { sendGameCommand } from "./game/input/gameEvents";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "./game/config";
import { PlayScene } from "./phaser/scenes/PlayScene";
import "./styles.css";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: DESIGN_WIDTH,
  height: DESIGN_HEIGHT,
  backgroundColor: "#17162b",
  scene: [PlayScene],
  render: {
    antialias: true,
    pixelArt: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
});

const angleValue = document.querySelector<HTMLElement>("#angle-value");
const powerValue = document.querySelector<HTMLElement>("#power-value");
const bounceValue = document.querySelector<HTMLElement>("#bounce-value");
const chargeFill = document.querySelector<HTMLElement>("#charge-fill");
const statusCopy = document.querySelector<HTMLElement>("#status-copy");
const fireButton = document.querySelector<HTMLButtonElement>("#fire-button");
const pauseButton = document.querySelector<HTMLButtonElement>("#pause-button");
const pausePanel = document.querySelector<HTMLElement>("#pause-panel");
const resumeButton = document.querySelector<HTMLButtonElement>("#resume-button");
const retryButton = document.querySelector<HTMLButtonElement>("#retry-button");
const dismissHelp = document.querySelector<HTMLButtonElement>("#dismiss-help");
const helpCard = document.querySelector<HTMLElement>("#help-card");

interface HudDetail {
  angle: number;
  speed: number;
  bounces: number;
  charging: boolean;
  charge: number;
  projectileActive: boolean;
}

window.addEventListener("odango-hud", (event) => {
  const detail = (event as CustomEvent<HudDetail>).detail;
  if (angleValue) angleValue.textContent = `${Math.round(detail.angle)}°`;
  if (powerValue) powerValue.textContent = `${Math.round(detail.speed)}`;
  if (bounceValue) bounceValue.textContent = `${detail.bounces} / 6`;
  if (chargeFill) chargeFill.style.setProperty("--charge", `${detail.charge * 100}%`);
  if (fireButton) {
    fireButton.classList.toggle("is-charging", detail.charging);
    fireButton.disabled = detail.projectileActive;
  }
  if (statusCopy) {
    statusCopy.textContent = detail.projectileActive
      ? "飛行中。反射を観察しよう"
      : detail.charging
        ? "離した瞬間の角度で発射"
        : "狙いを定めています";
  }
});

window.addEventListener("odango-pause", (event) => {
  if (pausePanel) pausePanel.hidden = !(event as CustomEvent<boolean>).detail;
});

const startCharge = (event: Event): void => {
  event.preventDefault();
  sendGameCommand("charge-start");
};
const releaseCharge = (event: Event): void => {
  event.preventDefault();
  sendGameCommand("charge-release");
};

fireButton?.addEventListener("pointerdown", startCharge);
fireButton?.addEventListener("pointerup", releaseCharge);
fireButton?.addEventListener("pointercancel", releaseCharge);
fireButton?.addEventListener("contextmenu", (event) => event.preventDefault());
pauseButton?.addEventListener("click", () => sendGameCommand("pause"));
resumeButton?.addEventListener("click", () => sendGameCommand("resume"));
retryButton?.addEventListener("click", () => sendGameCommand("retry"));
dismissHelp?.addEventListener("click", () => helpCard?.classList.add("is-dismissed"));

window.addEventListener("blur", () => sendGameCommand("pause"));
window.addEventListener("beforeunload", () => game.destroy(true));
