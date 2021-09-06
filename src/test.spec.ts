import { com } from './packer'
import { expect, assert } from 'chai';
// import rewire = require("rewire")
// const rewiredModule = rewire('./packer');
const Mobiquity = com.mobiquity.packer.Packer;


const PATH : string= '';
if (!PATH|| PATH&& PATH.length == 0) throw new Error('Please Update example_input Path file.');

describe('Test Package Challenge.', () => {
	let bin: string = '';
	let binItem: com.mobiquity.packer.Packer.BinInfo;
	context('Teset FileReader', () => {
		let fileReaderRss: Array <string> = []
		before(() => {
			fileReaderRss = new Mobiquity.FileReader(PATH).read();
		});

		it('should return Array', () => {
			expect(fileReaderRss)
				.to.be.an('array');
		});
		it('should return non Empty Array', () => {
			expect(fileReaderRss)
				.that.is.not.empty
		});
		it('should return Array of Strings', () => {
			fileReaderRss.forEach(row => { expect(row).to.be.an('string'); })
			bin = fileReaderRss[0];
		});
	});

	context('Teset Bin Class', () => {
		before(() => {
			binItem = new Mobiquity.Bin(bin).binDetails;
		});

		it('should return a Value', () => {
			expect(binItem)
				.to.be.an('object')
		});

		it('should Have BinInfo type', () => {
			expect(binItem).to.have.property('packages');
			expect(binItem).to.have.property('weight');
		});
	});

	context('Teset Bin Knapsack', () => {
		it('should return a String Value', () => {
			let knapsack = new Mobiquity.Knapsack(binItem.weight, binItem.packages).solve();
			expect(knapsack)
				.to.be.an('string')
		});

	});

	context('Teset Bin Packer', () => {
		it('should return a String Value', () => {
			let packer = Mobiquity.Packer.pack(PATH);
			expect(packer)
				.to.be.an('string')
		});
	});

});