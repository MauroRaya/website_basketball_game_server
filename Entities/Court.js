import { Hoop } from "./Hoop.js";
import { ThreePointLines } from "./ThreePointLines.js";

export class Court {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.hoops = {
      A: new Hoop(width / 2, 20),
      B: new Hoop(width / 2, height - 20)
    };

    this.threePointLines = {
      A: new ThreePointLines(width / 2, 0, 215),
      B: new ThreePointLines(width / 2, height, 215),
    };
  }

  getState() {
    return {
      width: this.width,
      height: this.height,
      hoops: {
        A: this.hoops.A.getState(),
        B: this.hoops.B.getState()
      },
      threePointLines: {
        A: this.threePointLines.A.getState(),
        B: this.threePointLines.B.getState()
      },
    };
  }
}