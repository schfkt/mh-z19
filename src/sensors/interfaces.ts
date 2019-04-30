export interface ISensor {
  readCo2Value(): Promise<number>;
}
