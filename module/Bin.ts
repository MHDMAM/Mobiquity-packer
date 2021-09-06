import { BinMaxWeight, BinMaxItems, ItemMaxWeight, ItemMaxCost, Node, BinInfo } from "./Types"
import { ApiError } from './error'
import _ from "lodash";

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
		if(this.weight > BinMaxWeight) throw new	ApiError('Package Max Weight Exceeded.')
		let rawPackages = items[1].split(' ');

		_.each(rawPackages, pakg => {
			let pkg = pakg.split(',');
			let _id = _.parseInt(pkg[0].replace(this.cleanUp, ''));
			let _weight = parseFloat(pkg[1].replace(this.cleanUp, ''));
			if(_weight > ItemMaxWeight) throw new ApiError('Item Too Heavy');

			let _cost = parseFloat(pkg[2].replace(this.cleanUp, ''));
			if(_cost > ItemMaxCost) throw new ApiError('Item Max Cost Exceeded.')
			let _packag = {id:_id,weight: _weight,cost: _cost};

			this.packages.push(_packag);
			if(this.packages.length > BinMaxItems) throw new ApiError('Too Many Items');
		})
	}

	get binDetails() : BinInfo {
		this.stringToBigInfo();
		return {packages: this.packages, weight: this.weight};
	}
};