export * from './board';
export * from './game';


export enum GamePhase {
  SelectMatrix = 0,
  PlaceStart = 1,
  PlaceEnd = 2,
  PlaceObstacles = 3,
  Play = 4,
}