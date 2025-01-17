// 
// Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
// https://kekse.biz/ https://github.com/kekse1/javascripts/
// v0.2.1
// 
// Two functions to measure the throughput of your data, in
// bytes per second (for milliseconds remove the multiplication
// with 1000); and the ETA ('Estimated Time Of Arrival') with
// '.remaining()', in milliseconds (multiply *1000 for seconds).
// 

//
const measure = {};

measure.throughput = (_size, _time) => {
	if(typeof _size === 'bigint') _size = Number(_size);
	if(typeof _time === 'bigint') _time = Number(_time / 1000000n);
	if(_size <= 0 || _time <= 0) return 0;
	return Math.max(0, (_size / _time * 1000)); };

measure.remaining = (_rest, _size, _time) => {
	if(typeof _size === 'bigint') _size = Number(_size);
	if(typeof _time === 'bigint') _time = Number(_time / 1000000n);
	if(typeof _rest === 'bigint') _rest = Number(_rest);
	if(_size <= 0 || _time <= 0 || _rest <= 0) return 0;
	return Math.max(0, (_rest / (_size / _time))); };

//
export default measure;

