/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v1.0.1
 */

/*
 * This code is an example on how you could handle or manage
 * possible _*DEBUG* switches_! ...
 *
 * 	# `const DEBUG_*` ... // no more.
 *
 * In the newest version >=1.0.0 my code is really much more
 * compact.. nearly not worth mentioning it .. but it helps.
 *
 * I realized that it's not really great to include the file
 * names/paths as first map key; because it was my intention
 * to NOT do so: my code had many 'const DEBUG_`, which were
 * partially the same over many files.
 *
 * I wanted to define them once, on a global location. .. so
 * this was meant to be! ;-)
 *
 */

//
const DEFAULT_THROW = true;	//recommended.. prevents from errors... sure.
const DEFAULT_KEY_UPPER = true;	//naming styles

//
const DEBUG = () => {
	const result = Object.keys(DEBUG);
	
	for(var i = result.length - 1; i >= 0; --i)
	{
		if(typeof result[i] !== 'function')
		{
			result.splice(i, 1);
		}
	}
	
	return result;
};

DEBUG.MAP = new Map();
export default DEBUG;

//
const key = (_key) => {
	if(typeof _key !== 'string') return _key;
	if(DEFAULT_KEY_UPPER) _key = _key.toUpperCase();
	return _key; };

const create = (_index, _key, _value, ... _param) => {
	return {
		key: key(_key),
		value: _value,
		param: _param,
		index: _index }; };

//
DEBUG.has = (_key) => (DEBUG.MAP.has(key(_key)));
DEBUG.count = () => (DEBUG.MAP.size);
DEBUG.keys = () => [ ... DEBUG.MAP.keys() ];

DEBUG.clear = () => {
	const result = [ ... DEBUG.MAP.entries() ];
	DEBUG.MAP.clear(); return result;
};

DEBUG.set = (_key, _value, ... _param) => {
	const orig = (DEBUG.MAP.has(_key = key(_key)) ?
		DEBUG.MAP.get(_key) : null);
	const index = (orig ? orig.index : DEBUG.MAP.size);
	const item = create(index, _key, _value, _param);
	DEBUG.MAP.set(item.key, item);
	return item;
};

DEBUG.get = (_key, _raw = false, _throw = DEFAULT_THROW) => {
	if(!DEBUG.MAP.has(_key = key(_key)))
	{
		if(_throw)
		{
			throw new Error('There\'s no such item' +
				(typeof _key === 'string' ?
					' `' + _key + '`' : ''));
		}
		
		return undefined;
	}
	
	const result = DEBUG.MAP.get(_key);
	if(!_raw) return result.value;
	return result;
};

DEBUG.remove = (_key, _throw = DEFAULT_THROW) => {
	if(!DEBUG.MAP.has(_key = key(_key)))
	{
		return undefined;
	}
	
	const result = DEBUG.MAP.get(_key);
	DEBUG.MAP.delete(_key);
	return result;
};

//
