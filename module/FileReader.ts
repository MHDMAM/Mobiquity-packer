import * as fs from 'fs';
import { ApiError } from './error'

export class FileReader {
	path: string = '';
	constructor(path: string) {
		if (!path) throw new ApiError('File Path is Required.');
		this.path = path;
	}

	read() {
		let stat = fs.statSync(this.path)
		if (stat && stat.isFile() && stat.size > 0) {
			return fs.readFileSync(this.path, 'utf-8').toString().split('\n');
		}
		throw new ApiError('File Not Exists.');
	};
}