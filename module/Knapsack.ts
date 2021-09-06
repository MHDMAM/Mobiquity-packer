import _ from "lodash";
import { BinMaxWeight, BinMaxItems, ItemMaxWeight, ItemMaxCost, Node, SubSoultion } from './Types';

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