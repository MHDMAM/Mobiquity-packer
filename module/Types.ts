import _ from 'lodash';

export const BinMaxWeight: number = 100;
export const BinMaxItems: number = 15;
export const ItemMaxWeight: number = 100;
export const ItemMaxCost: number = 100;

export interface Node {
  id: number;
  weight: number;
  cost: number;
}

export interface BinInfo {
  packages: Array<Node>;
  weight: number;
}

export class SubSoultion {
  private _totalCost: number;
  private _totalWeight: number;
  private items: Array<Node> = [];

  constructor() {
    this._totalCost = 0;
    this._totalWeight = 0;
    // this.items = items;
  }
  set addNode(node: Node){
    this.items.push(node);
    this.update();
  }

  get totalWeight(){
    return this._totalWeight;
  }

  get totalCost(){
    return this._totalCost;
  }

  private _parseFloat(num: any) {
    if (typeof num !== 'number') num = parseFloat(num);
    return parseFloat(num.toFixed(2));
  }

  private update() {
    this._totalWeight = this._totalCost = 0;
    _.each(this.items, (item) => {
      this._totalWeight += item.weight;
      this._totalCost += item.cost;
    });

    this._totalWeight = this._parseFloat(this._totalWeight)
    this._totalCost = this._parseFloat(this.totalCost)
  }
}
