import Phaser from "phaser";
import { scoreConfig } from "./game/balance";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "./game/config";
import { sendGameCommand } from "./game/input/gameEvents";
import {
  calculateRank,
  createDefaultProgress,
  parseProgress,
  recordStageResult,
  type ProgressData,
} from "./game/progress";
import { validationStages } from "./game/stage";
import { PlayScene } from "./phaser/scenes/PlayScene";
import "./styles.css";

type GameStatus = "playing" | "won" | "lost";
type FeedbackKind = "ball" | "complete" | "incomplete" | "bomb" | "launch";
type ScreenName = "title" | "stage" | "play";

interface HudDetail {
  angle: number;
  speed: number;
  charging: boolean;
  charge: number;
  skewerActive: boolean;
  attachedBalls: number;
  score: number;
  skewers: number;
  balls: number;
  status: GameStatus;
  targetScore: number;
  shotResult: "complete" | "incomplete" | null;
  stageIndex: number;
  stageCount: number;
  stageName: string;
  stageObjective: string;
  dangoMenuText: string;
}

interface FeedbackDetail {
  kind: FeedbackKind;
  count?: number;
  bonusPoints?: number;
  bonusLabel?: string;
  dangoName?: string;
  menuCompleted?: boolean;
}

interface GameSettings {
  bgmVolume: number;
  sfxVolume: number;
  screenShake: boolean;
  trajectoryAssist: boolean;
}

const settingsKey = "odango-settings";
const progressKey = "odango-progress";
const defaultSettings: GameSettings = {
  bgmVolume: 0.3,
  sfxVolume: 0.7,
  screenShake: true,
  trajectoryAssist: true,
};

const query = <T extends Element>(selector: string): T | null =>
  document.querySelector<T>(selector);

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

const shell = query<HTMLElement>(".game-shell");
const hud = query<HTMLElement>("#hud");
const controls = query<HTMLElement>("#controls");
const stageNav = query<HTMLElement>("#stage-nav");
const titleScreen = query<HTMLElement>("#title-screen");
const stageScreen = query<HTMLElement>("#stage-screen");
const pausePanel = query<HTMLElement>("#pause-panel");
const resultPanel = query<HTMLElement>("#result-panel");
const settingsPanel = query<HTMLElement>("#settings-panel");
const helpCard = query<HTMLElement>("#help-card");
const feedbackBanner = query<HTMLElement>("#feedback-banner");

const scoreValue = query<HTMLElement>("#score-value");
const ballValue = query<HTMLElement>("#ball-value");
const ammoValue = query<HTMLElement>("#ammo-value");
const skewerValue = query<HTMLElement>("#skewer-value");
const chargeFill = query<HTMLElement>("#charge-fill");
const statusCopy = query<HTMLElement>("#status-copy");
const fireButton = query<HTMLButtonElement>("#fire-button");
const resultEyebrow = query<HTMLElement>("#result-eyebrow");
const resultTitle = query<HTMLElement>("#result-title");
const resultScore = query<HTMLElement>("#result-score");
const resultRank = query<HTMLElement>("#result-rank");
const resultMessage = query<HTMLElement>("#result-message");
const stageCounter = query<HTMLElement>("#stage-counter");
const stageName = query<HTMLElement>("#stage-name");
const stageObjective = query<HTMLElement>("#stage-objective");
const stageMenu = query<HTMLElement>("#stage-menu");
const stageGrid = query<HTMLElement>("#stage-grid");
const feedbackSymbol = query<HTMLElement>("#feedback-symbol");
const feedbackCopy = query<HTMLElement>("#feedback-copy");
const previousStageButton = query<HTMLButtonElement>("#previous-stage");
const nextStageButton = query<HTMLButtonElement>("#next-stage");
const resultNextButton = query<HTMLButtonElement>("#result-next-button");

const bgmVolume = query<HTMLInputElement>("#bgm-volume");
const sfxVolume = query<HTMLInputElement>("#sfx-volume");
const screenShake = query<HTMLInputElement>("#screen-shake");
const trajectoryAssist = query<HTMLInputElement>("#trajectory-assist");
const bgmOutput = query<HTMLOutputElement>("#bgm-output");
const sfxOutput = query<HTMLOutputElement>("#sfx-output");

let currentScreen: ScreenName = "title";
let currentStageIndex = 0;
let settingsReturnScreen: ScreenName = "title";
let feedbackTimer = 0;
let wasCharging = false;
let settings = loadSettings();
let progress = loadProgress();
let recordedResultKey = "";

class AudioController {
  private context: AudioContext | null = null;
  private chargeOscillator: OscillatorNode | null = null;
  private chargeGain: GainNode | null = null;
  private bgmTimer = 0;
  private bgmStep = 0;

  async unlock(): Promise<void> {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
  }

  setPlaying(playing: boolean): void {
    window.clearInterval(this.bgmTimer);
    this.bgmTimer = 0;
    if (!playing || settings.bgmVolume <= 0) return;
    this.bgmTimer = window.setInterval(() => {
      const notes = [293.66, 392, 440, 392, 329.63, 392];
      this.tone(notes[this.bgmStep % notes.length], 0.16, settings.bgmVolume * 0.1, "sine");
      this.bgmStep += 1;
    }, 620);
  }

  startCharge(): void {
    void this.unlock().then(() => {
      if (!this.context || this.chargeOscillator || settings.sfxVolume <= 0) return;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 180;
      gain.gain.value = settings.sfxVolume * 0.045;
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start();
      this.chargeOscillator = oscillator;
      this.chargeGain = gain;
    });
  }

  updateCharge(progress: number): void {
    if (!this.context || !this.chargeOscillator) return;
    this.chargeOscillator.frequency.setTargetAtTime(
      180 + progress * 420,
      this.context.currentTime,
      0.03,
    );
  }

  stopCharge(): void {
    if (!this.context || !this.chargeOscillator || !this.chargeGain) return;
    const now = this.context.currentTime;
    this.chargeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    this.chargeOscillator.stop(now + 0.07);
    this.chargeOscillator = null;
    this.chargeGain = null;
  }

  feedback(kind: FeedbackKind, count = 0): void {
    void this.unlock().then(() => {
      const volume = settings.sfxVolume * 0.18;
      if (volume <= 0) return;
      if (kind === "ball") {
        this.tone([520, 660, 820][Math.max(0, count - 1)] ?? 520, 0.12, volume, "sine");
      } else if (kind === "complete") {
        this.tone(784, 0.22, volume, "triangle");
        window.setTimeout(() => this.tone(1046, 0.25, volume, "triangle"), 90);
      } else if (kind === "incomplete") {
        this.tone(180, 0.18, volume * 0.7, "square");
      } else if (kind === "bomb") {
        this.tone(72, 0.42, volume, "sawtooth");
      } else if (kind === "launch") {
        this.tone(360, 0.08, volume * 0.6, "triangle");
      }
    });
  }

  private tone(
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType,
  ): void {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(Math.max(0.0001, volume), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

const audio = new AudioController();

function loadSettings(): GameSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(settingsKey) ?? "{}") as Partial<GameSettings>;
    return { ...defaultSettings, ...saved };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings(): void {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent<GameSettings>("odango-settings", { detail: settings }));
}

function loadProgress(): ProgressData {
  return parseProgress(
    localStorage.getItem(progressKey),
    validationStages.length,
  );
}

function saveProgress(): void {
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

function syncSettingsForm(): void {
  if (bgmVolume) bgmVolume.value = `${Math.round(settings.bgmVolume * 100)}`;
  if (sfxVolume) sfxVolume.value = `${Math.round(settings.sfxVolume * 100)}`;
  if (screenShake) screenShake.checked = settings.screenShake;
  if (trajectoryAssist) trajectoryAssist.checked = settings.trajectoryAssist;
  if (bgmOutput) bgmOutput.value = `${Math.round(settings.bgmVolume * 100)}`;
  if (sfxOutput) sfxOutput.value = `${Math.round(settings.sfxVolume * 100)}`;
}

function setGameplayUi(visible: boolean): void {
  if (hud) hud.hidden = !visible;
  if (controls) controls.hidden = !visible;
  if (stageNav) stageNav.hidden = !visible;
  if (!visible && helpCard) helpCard.hidden = true;
}

function showScreen(screen: ScreenName, stageIndex = currentStageIndex): void {
  if (
    screen === "play" &&
    (stageIndex < 0 || stageIndex >= validationStages.length)
  ) {
    screen = "stage";
  }
  currentScreen = screen;
  if (titleScreen) titleScreen.hidden = screen !== "title";
  if (stageScreen) stageScreen.hidden = screen !== "stage";
  if (pausePanel) pausePanel.hidden = true;
  if (resultPanel) resultPanel.hidden = true;
  if (settingsPanel) settingsPanel.hidden = true;
  shell?.classList.toggle("is-menu-open", screen !== "play");
  setGameplayUi(screen === "play");

  if (screen === "play") {
    currentStageIndex = stageIndex;
    recordedResultKey = "";
    sendGameCommand({ type: "load-stage", stageIndex });
    if (helpCard) helpCard.hidden = sessionStorage.getItem("odango-help-seen") === "1";
    audio.setPlaying(true);
  } else {
    sendGameCommand("pause");
    audio.stopCharge();
    audio.setPlaying(false);
  }
  if (screen === "stage") renderStageCards();
}

function openSettings(): void {
  settingsReturnScreen = currentScreen;
  syncSettingsForm();
  if (settingsPanel) settingsPanel.hidden = false;
  if (currentScreen === "play") sendGameCommand("pause");
}

function closeSettings(): void {
  if (settingsPanel) settingsPanel.hidden = true;
  if (settingsReturnScreen === "play" && pausePanel) pausePanel.hidden = false;
}

function renderStageCards(): void {
  if (!stageGrid) return;
  stageGrid.replaceChildren();
  validationStages.forEach((stage, index) => {
    const saved = progress.stages[stage.id];
    const rank = saved?.cleared
      ? calculateRank(saved.bestScore, stage.targetScore, true)
      : null;
    const button = document.createElement("button");
    button.className = "stage-card";
    button.type = "button";
    button.dataset.chapter = `${stage.chapter ?? 1}`;
    button.innerHTML = `
      <span>${String(index + 1).padStart(2, "0")}</span>
      <strong>${stage.name ?? stage.id}</strong>
      <small>${stage.objective ?? ""}</small>
      <em>${
        saved
          ? `BEST ${saved.bestScore.toLocaleString("ja-JP")} / RANK ${rank ?? "C"}`
          : `第${stage.chapter ?? 1}章 / 残り串 ${stage.skewers}`
      }</em>
    `;
    button.addEventListener("click", () => showScreen("play", index));
    stageGrid.append(button);
  });
}

function showFeedback(detail: FeedbackDetail): void {
  const completePoints = scoreConfig.completedSkewer + (detail.bonusPoints ?? 0);
  const completeName = detail.dangoName ?? "三色だんご";
  const bonusCopy = detail.bonusPoints
    ? ` ${detail.bonusLabel || "ボーナス"}込み`
    : "";
  const completeCopy = detail.bonusPoints
    ? `${completeName}完成！${bonusCopy} +${completePoints}`
    : `${completeName}完成！ +${scoreConfig.completedSkewer}`;
  const content: Record<FeedbackKind, { symbol: string; copy: string }> = {
    ball: {
      symbol: `${detail.count ?? 1}`,
      copy: detail.count === 3 ? "三個そろった！ 壁まで届けよう" : `${detail.count ?? 1}個目を刺した！`,
    },
    complete: { symbol: "祝", copy: completeCopy },
    incomplete: { symbol: "戻", copy: "未完成。おだんごは元の位置へ" },
    bomb: { symbol: "危", copy: "爆弾！ 残り串とスコアにペナルティ" },
    launch: { symbol: "→", copy: "発射！ 串先端で三個を狙おう" },
  };
  const item = content[detail.kind];
  if (feedbackSymbol) feedbackSymbol.textContent = item.symbol;
  if (feedbackCopy) feedbackCopy.textContent = item.copy;
  if (feedbackBanner) {
    feedbackBanner.dataset.kind = detail.kind;
    feedbackBanner.classList.remove("is-visible");
    void feedbackBanner.offsetWidth;
    feedbackBanner.classList.add("is-visible");
  }
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(
    () => feedbackBanner?.classList.remove("is-visible"),
    detail.kind === "complete" ? 1800 : 1300,
  );
  audio.feedback(detail.kind, detail.count);
}

window.addEventListener("odango-ready", () => {
  sendGameCommand("pause");
  window.dispatchEvent(new CustomEvent<GameSettings>("odango-settings", { detail: settings }));
});

window.addEventListener("odango-hud", (event) => {
  const detail = (event as CustomEvent<HudDetail>).detail;
  currentStageIndex = detail.stageIndex;
  if (detail.status === "playing") recordedResultKey = "";
  if (scoreValue) scoreValue.textContent = detail.score.toLocaleString("ja-JP");
  if (ballValue) ballValue.textContent = `${detail.balls}`;
  if (ammoValue) ammoValue.textContent = `${detail.skewers}`;
  if (skewerValue) {
    skewerValue.textContent = [0, 1, 2]
      .map((index) => index < detail.attachedBalls ? "●" : "○")
      .join(" ");
    skewerValue.dataset.count = `${detail.attachedBalls}`;
  }
  if (stageCounter) stageCounter.textContent = `STAGE ${detail.stageIndex + 1} / ${detail.stageCount}`;
  if (stageName) stageName.textContent = detail.stageName;
  if (stageObjective) stageObjective.textContent = detail.stageObjective;
  if (stageMenu) stageMenu.textContent = detail.dangoMenuText;
  if (previousStageButton) {
    previousStageButton.disabled = detail.stageIndex <= 0;
  }
  if (nextStageButton) {
    nextStageButton.disabled =
      detail.stageIndex + 1 >= validationStages.length;
  }
  if (chargeFill) chargeFill.style.setProperty("--charge", `${detail.charge * 100}%`);
  if (detail.charging && !wasCharging) audio.startCharge();
  if (!detail.charging && wasCharging) audio.stopCharge();
  wasCharging = detail.charging;
  audio.updateCharge(detail.charge);

  if (fireButton) {
    fireButton.classList.toggle("is-charging", detail.charging);
    fireButton.disabled =
      detail.skewerActive || detail.status !== "playing" || detail.skewers <= 0;
  }
  if (statusCopy) {
    statusCopy.textContent = detail.status !== "playing"
      ? "リザルトを確認してください"
      : detail.attachedBalls === 3
        ? "三個完成。壁に当てるまでが勝負"
        : detail.skewerActive
          ? `${detail.attachedBalls} / 3 個。串先端で続きを狙おう`
          : detail.charging
            ? "チャージ中。離すとこの角度で発射"
            : "照準を決め、長押しでチャージ";
  }

  if (resultPanel && currentScreen === "play") {
    resultPanel.hidden = detail.status === "playing";
    if (detail.status !== "playing") {
      const won = detail.status === "won";
      const rank = calculateRank(detail.score, detail.targetScore, won);
      const resultKey = `${detail.stageIndex}:${detail.status}:${detail.score}`;
      if (recordedResultKey !== resultKey) {
        recordedResultKey = resultKey;
        const stage = validationStages[detail.stageIndex];
        progress = recordStageResult(
          progress,
          stage.id,
          detail.stageIndex,
          validationStages.length,
          detail.score,
          won,
        );
        saveProgress();
        renderStageCards();
      }
      if (resultEyebrow) resultEyebrow.textContent = won ? "STAGE CLEAR" : "STAGE FAILED";
      if (resultTitle) resultTitle.textContent = won ? "おみごと！" : "串切れです";
      if (resultScore) resultScore.textContent = detail.score.toLocaleString("ja-JP");
      if (resultRank) resultRank.textContent = rank;
      if (resultMessage) {
        resultMessage.textContent = won
          ? "三色だんごをすべて壁へ届けました。"
          : "角度かチャージを変えて、もう一度試してみよう。";
      }
      if (resultNextButton) {
        const finalStage = detail.stageIndex === validationStages.length - 1;
        resultNextButton.textContent = finalStage ? "ステージ選択へ" : "次のステージ";
        resultNextButton.disabled = false;
      }
      audio.setPlaying(false);
    }
  }
});

window.addEventListener("odango-feedback", (event) => {
  showFeedback((event as CustomEvent<FeedbackDetail>).detail);
});

window.addEventListener("odango-pause", (event) => {
  if (!pausePanel || currentScreen !== "play" || !settingsPanel?.hidden) return;
  pausePanel.hidden = !(event as CustomEvent<boolean>).detail;
});

const startCharge = (event: PointerEvent): void => {
  event.preventDefault();
  fireButton?.setPointerCapture(event.pointerId);
  audio.startCharge();
  sendGameCommand("charge-start");
};

const releaseCharge = (event: PointerEvent): void => {
  event.preventDefault();
  audio.stopCharge();
  sendGameCommand("charge-release");
};

fireButton?.addEventListener("pointerdown", startCharge);
fireButton?.addEventListener("pointerup", releaseCharge);
fireButton?.addEventListener("pointercancel", releaseCharge);
fireButton?.addEventListener("contextmenu", (event) => event.preventDefault());
query("#pause-button")?.addEventListener("click", () => sendGameCommand("pause"));
query("#resume-button")?.addEventListener("click", () => sendGameCommand("resume"));
query("#retry-button")?.addEventListener("click", () => sendGameCommand("retry"));
query("#result-retry-button")?.addEventListener("click", () => sendGameCommand("retry"));
resultNextButton?.addEventListener("click", () => {
  if (currentStageIndex >= validationStages.length - 1) {
    showScreen("stage");
  } else {
    showScreen("play", currentStageIndex + 1);
  }
});
previousStageButton?.addEventListener("click", () => {
  showScreen("play", currentStageIndex - 1);
});
nextStageButton?.addEventListener("click", () => {
  showScreen("play", currentStageIndex + 1);
});
query("#start-button")?.addEventListener("click", () => showScreen("stage"));
query("#stage-back-button")?.addEventListener("click", () => showScreen("title"));
query("#pause-stage-button")?.addEventListener("click", () => showScreen("stage"));
query("#result-stage-button")?.addEventListener("click", () => showScreen("stage"));
query("#dismiss-help")?.addEventListener("click", () => {
  sessionStorage.setItem("odango-help-seen", "1");
  if (helpCard) helpCard.hidden = true;
});

document.querySelectorAll<HTMLButtonElement>(".open-settings").forEach((button) => {
  button.addEventListener("click", openSettings);
});
query("#settings-close-button")?.addEventListener("click", closeSettings);
query("#reset-data-button")?.addEventListener("click", () => {
  settings = { ...defaultSettings };
  progress = createDefaultProgress(validationStages.length);
  localStorage.removeItem(settingsKey);
  localStorage.removeItem(progressKey);
  syncSettingsForm();
  saveSettings();
  renderStageCards();
  audio.setPlaying(currentScreen === "play");
});

bgmVolume?.addEventListener("input", () => {
  settings.bgmVolume = Number(bgmVolume.value) / 100;
  if (bgmOutput) bgmOutput.value = bgmVolume.value;
  saveSettings();
  audio.setPlaying(currentScreen === "play");
});
sfxVolume?.addEventListener("input", () => {
  settings.sfxVolume = Number(sfxVolume.value) / 100;
  if (sfxOutput) sfxOutput.value = sfxVolume.value;
  saveSettings();
});
screenShake?.addEventListener("change", () => {
  settings.screenShake = screenShake.checked;
  saveSettings();
});
trajectoryAssist?.addEventListener("change", () => {
  settings.trajectoryAssist = trajectoryAssist.checked;
  saveSettings();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (settingsPanel && !settingsPanel.hidden) {
    closeSettings();
  } else if (currentScreen === "play") {
    sendGameCommand("pause");
  }
});

window.addEventListener("blur", () => {
  audio.stopCharge();
  if (currentScreen === "play") sendGameCommand("pause");
});
window.addEventListener("beforeunload", () => game.destroy(true));

renderStageCards();
syncSettingsForm();
showScreen("title");
