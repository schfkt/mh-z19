import SerialPort from "serialport";
import { ISensor } from "../interfaces";
import { IMhz19SensorDependencies } from "./interfaces";
import { READ_VALUE_COMMAND } from "./constants";

export class Mhz19Sensor implements ISensor {
  private serialPort: SerialPort;

  constructor({serialPortPath}: IMhz19SensorDependencies) {
    this.serialPort = new SerialPort(serialPortPath, {baudRate: 9600, autoOpen: false});
  }

  public async readCo2Value(): Promise<number> {
    await this.openSerialPort();
    return this.readCo2DataFromSerialPort();
  }

  private async openSerialPort(): Promise<void> {
    if (this.isSerialPortOpened()) return;

    return new Promise<void>((resolve, reject) => {
      this.serialPort.open((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async readCo2DataFromSerialPort(): Promise<number> {
    const resultPromise = new Promise<number>((resolve, reject) => {
      this.serialPort.once("readable", () => {
        const binaryData = this.serialPort.read(9) as Buffer;

        if (binaryData === null || Buffer.byteLength(binaryData) !== 9) {
          return reject(new Error(`Unexpected data received ${binaryData}`));
        }

        if (!this.isCo2BinaryData(binaryData)) {
          return reject(new Error(`Unexpected data received ${binaryData}`));
        }

        // TODO: Verify CRC

        const co2Value = Number(binaryData[2].toString()) * 256 + Number(binaryData[3].toString());
        resolve(co2Value);
      });
    });

    await this.writeCommand(READ_VALUE_COMMAND);

    return resultPromise;
  }

  private async writeCommand(command: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.serialPort.write(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private isSerialPortOpened(): boolean {
    return this.serialPort.isOpen;
  }

  private isCo2BinaryData(binaryData: Buffer): boolean {
    return binaryData[0] === 0xFF && binaryData[1] === 0x86;
  }
}
