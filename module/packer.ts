import _ from 'lodash';
import { FileReader } from './FileReader'
import { Bin } from "./Bin"
import { Knapsack } from "./Knapsack"
import { ApiError } from './error'

export class Packer {
  static pack(inputFile: string): string {
    // read file
    let soultion: Array<string> = [];
    let fileReader = new FileReader(inputFile);
    let binsLines = fileReader.read();
    if (!binsLines || binsLines.length == 0) throw new ApiError('raed file error.');

    // parse file inputs:
    _.each(binsLines, _bin => {
      let bin = new Bin(_bin).binDetails;
      // choose items.
      let knapsack = new Knapsack(bin.weight, bin.packages);
      let answer = knapsack.solve();
      soultion.push(answer);
    })
    return soultion.join('\n')
  }
}