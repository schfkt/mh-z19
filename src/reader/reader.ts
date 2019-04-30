import fs from "fs";
import { IReaderDependencies, IReaderConfig} from "./interfaces";
import { Mhz19Sensor, ISensor } from "../sensors";

export class Reader {
  private config: IReaderConfig;
  private co2Sensor: ISensor;

  constructor({configPath}: IReaderDependencies) {
    this.config = this.readConfig(configPath);
    this.co2Sensor = new Mhz19Sensor({serialPortPath: this.config.serialPortPath});
  }

  public async readAndPrintValue() {
    const co2Value = await this.co2Sensor.readCo2Value();
    console.log(`${new Date().toISOString()}: CO2 ${co2Value} PPM`);
  }

  private readConfig(configPath: string): IReaderConfig {
    const rawConfigData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(rawConfigData);
  }
}
