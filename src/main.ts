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

const scoreValue = document.querySelector<HTMLElement>("#score-value");
const enemyValue = document.querySelector<HTMLElement>("#enemy-value");
const ammoValue = document.querySelector<HTMLElement>("#ammo-value");
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
const resultPanel = document.querySelector<HTMLElement>("#result-panel");
const resultEyebrow = document.querySelector<HTMLElement>("#result-eyebrow");
const resultTitle = document.querySelector<HTMLElement>("#result-title");
const resultScore = document.querySelector<HTMLElement>("#result-score");
const resultRank = document.querySelector<HTMLElement>("#result-rank");
const resultRetryButton = document.querySelector<HTMLButtonElement>("#result-retry-button");

interface HudDetail {
  angle: number;
  speed: number;
  bounces: number;
  charging: boolean;
  charge: number;
  projectileActive: boolean;
  score: number;
  ammo: number;
  enemies: number;
  combo: number;
  status: "playing" | "won" | "lost";
  targetScore: number;
}

window.addEventListener("odango-hud", (event) => {
  const detail = (event as CustomEvent<HudDetail>).detail;
  if (scoreValue) scoreValue.textContent = detail.score.toLocaleString("ja-JP");
  if (enemyValue) enemyValue.textContent = `${detail.enemies}`;
  if (ammoValue) ammoValue.textContent = `${detail.ammo}`;
  if (bounceValue) bounceValue.textContent = `${detail.bounces} / 6`;
  if (chargeFill) chargeFill.style.setProperty("--charge", `${detail.charge * 100}%`);
  if (fireButton) {
    fireButton.classList.toggle("is-charging", detail.charging);
    fireButton.disabled = detail.projectileActive || detail.status !== "playing" || detail.ammo <= 0;
  }
  if (statusCopy) {
    statusCopy.textContent = detail.status !== "playing"
      ? "リザルトを確認してください"
      : detail.projectileActive
      ? "飛行中。反射を観察しよう"
      : detail.combo > 1
        ? `${detail.combo}体 貫通コンボ！`
      : detail.charging
        ? "離した瞬間の角度で発射"
        : "狙いを定めています";
  }
  if (resultPanel) {
    resultPanel.hidden = detail.status === "playing";
    if (detail.status !== "playing") {
      const won = detail.status === "won";
      const ratio = detail.score / detail.targetScore;
      const rank = !won ? "C" : ratio >= 1.2 ? "S" : ratio >= 1 ? "A" : "B";
      if (resultEyebrow) resultEyebrow.textContent = won ? "STAGE CLEAR" : "STAGE FAILED";
      if (resultTitle) resultTitle.textContent = won ? "おみごと！" : "弾切れです";
      if (resultScore) resultScore.textContent = detail.score.toLocaleString("ja-JP");
      if (resultRank) resultRank.textContent = rank;
    }
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
resultRetryButton?.addEventListener("click", () => sendGameCommand("retry"));
dismissHelp?.addEventListener("click", () => helpCard?.classList.add("is-dismissed"));

window.addEventListener("blur", () => sendGameCommand("pause"));
window.addEventListener("beforeunload", () => game.destroy(true));
