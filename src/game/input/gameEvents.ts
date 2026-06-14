export type GameCommand =
  | "charge-start"
  | "charge-release"
  | "pause"
  | "resume"
  | "retry";

export const gameEvents = new EventTarget();

export function sendGameCommand(command: GameCommand): void {
  gameEvents.dispatchEvent(new CustomEvent<GameCommand>("command", { detail: command }));
}
