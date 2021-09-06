import * as fs from 'fs';
import * as  _APIException from './error'
import _ from "lodash";


export namespace com.mobiquity.packer.Packer {
	const MobiquityException = _APIException.com.mobiquity.packer.APIException
	export class Packer {
	  static pack(inputFile: string): string {
	    // read file
	    let soultion: Array<string> = [];
	    let fileReader = new FileReader(inputFile);
	    let binsLines = fileReader.read();
	    if (!binsLines || binsLines.length == 0) throw new MobiquityException.ApiError('raed file error.');

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


	export class Bin {
		private cleanUp = /[(),€ ]/g; 
		bin: string;
		packages: Array<Node>;
		weight: number;
		constructor(bin: string) {
			this.bin = bin;
			this.packages = [];
			this.weight = 0;
		}

		private stringToBigInfo() {
			let items = this.bin.split(' : ');
			this.weight = parseFloat(items[0]);
			if(this.weight > BinMaxWeight) throw new	MobiquityException.ApiError('Package Max Weight Exceeded.')
			let rawPackages = items[1].split(' ');

			_.each(rawPackages, pakg => {
				let pkg = pakg.split(',');
				let _id = _.parseInt(pkg[0].replace(this.cleanUp, ''));
				let _weight = parseFloat(pkg[1].replace(this.cleanUp, ''));
				if(_weight > ItemMaxWeight) throw new MobiquityException.ApiError('Item Too Heavy');

				let _cost = parseFloat(pkg[2].replace(this.cleanUp, ''));
				if(_cost > ItemMaxCost) throw new MobiquityException.ApiError('Item Max Cost Exceeded.')
				let _packag = {id:_id,weight: _weight,cost: _cost};

				this.packages.push(_packag);
				if(this.packages.length > BinMaxItems) throw new MobiquityException.ApiError('Too Many Items');
			})
		}

		get binDetails() : BinInfo {
			this.stringToBigInfo();
			return {packages: this.packages, weight: this.weight};
		}
	};


	export class FileReader {
		path: string = '';
		constructor(path: string) {
			if (!path) throw new MobiquityException.ApiError('File Path is Required.');
			this.path = path;
		}

		read() {
			let stat = fs.statSync(this.path)
			if (stat && stat.isFile() && stat.size > 0) {
				return fs.readFileSync(this.path, 'utf-8').toString().split('\n');
			}
			throw new MobiquityException.ApiError('File Not Exists.');
		};
	}

	export class Knapsack {
		private table: Array<SubSoultion> = [];
		private items: Array<Node> = [];
		private binItems: any = [];
		binWeight: number;
		constructor(weight:number, items:Array<Node>) {
			if (items.length == 0 || items.length > BinMaxItems) throw new Error('Invalid Items.');
			if (!weight || weight > BinMaxWeight) throw new Error('Invalid Weight');
			// this.table = [];
			this.binWeight = weight;
			// clean up items
			this.filterItems(items);
		}

		// Knapsack Algorithm is greedy algorithm, as long we sure items of weight > binWeight won't be picked, I drop them ahead, to save some computing resources.  
		private filterItems(items: Array<Node>) {
			items.forEach((item:Node) => {
				// remove items of weight > bin weight
				if (item.weight <= this.binWeight )
					this.items.push(item);
			});
			// sort by higher cost then less weight, should help with picking high cost less weight, in order..
			this.items.sort((a, b) => b.cost - a.cost || a.weight - b.weight);
			// remove items with same cost higher weight. I believe the sort above will take care of this.
			// let toRemove = [];
			// _.each(items, item => {
			// 	let remove = _.find(items, f => f.cost === item.cost && f.weight > item.weight)
			// 	if (remove) toRemove.push(remove)
			// });
			// _.each(toRemove, r => _.remove(this.items, t => t.id == r.id))

		}

		solve() {

			for (let i = 0; i < this.items.length; i++) {
				let currentItem = this.items[i];
				let subSoultion = new SubSoultion();
				// let isSameCostLess
				let weightRemainder = this.binWeight - currentItem.weight;
				let candidateList = _.filter(this.items, (i:Node) => i.weight < weightRemainder && i.id !== currentItem.id)
				subSoultion.addNode =currentItem;
				candidateList.sort((a, b) => b.cost - a.cost || a.weight - b.weight);

				for (let j = 0; j < candidateList.length; j++) {
					if (subSoultion.totalWeight > this.binWeight) break;
					if (candidateList[j].id === currentItem.id) continue;
					if (subSoultion.totalWeight + candidateList[j].weight < this.binWeight) {
						subSoultion.addNode = candidateList[j];
					}
				}
				this.table.push(subSoultion);
			}
			if (this.table.length == 0) return '-';
			this.binItems = this.table.reduce((prev, current) => {
				return (prev.totalCost > current.totalCost) ? prev : current
			})
			return this.toString()
		}

		toString() {
			return this.binItems.items.map((item: Node) => item.id).reverse().join(',')
		}
	}
}