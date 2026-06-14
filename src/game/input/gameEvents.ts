export type GameCommand =
  | "charge-start"
  | "charge-release"
  | "pause"
  | "resume"
  | "retry"
  | "previous-stage"
  | "next-stage";

export const gameEvents = new EventTarget();

export function sendGameCommand(command: GameCommand): void {
  gameEvents.dispatchEvent(new CustomEvent<GameCommand>("command", { detail: command }));
}
