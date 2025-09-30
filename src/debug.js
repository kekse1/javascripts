/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v1.3.0
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
const DEBUG = (... _args) => DEBUG.get(... _args);
DEBUG.MAP = new Map(); DEBUG.ID = new Map();
export default DEBUG;

//
DEBUG.DEBUG = true; // 'base get() request' if undefined _key param.

//
const checkID = (_id, _check = false) => {
	if(typeof _id !== 'number' || _id < 0 || (_id % 1) !== 0)
	{
		throw new Error('ID needs to be a positive integer');
	}
	
	if(_check && DEBUG.ID.has(_id))
	{
		throw new Error('ID already exists');
	}

	return _id;
};

const checkKey = (_key, _check = false) => {
	if(typeof _key === 'number')
	{
		if(!DEBUG.ID.has(checkID(_key, false)))
		{
			throw new Error('No such ID available');
		}
		
		return DEBUG.ID.get(_key).key;
	}

	if(typeof _key !== 'string' || _key.length === 0)
	{
		throw new Error('Key needs to be a non-empty String');
	}

	if(_check && !DEBUG.MAP.has(_key))
	{
		throw new Error('This ID is unknown');
	}

	return _key;
};

const create = (_key, _value, ... _param) => {
	if(typeof _key !== 'string' || _key.length === 0)
	{
		throw new Error('Key needs to be a non-empty String');
	}
	
	if(DEBUG.MAP.has(_key))
	{
		throw new Error('Your key already exists');
	}

	const result = {
		id: null,
		key: _key,
		value: _value,
		desc: ''
	};

	for(const p of _param)
	{
		if(typeof p === 'string')
		{
			result.desc = p;
		}
		else if(typeof p === 'number')
		{
			result.id = checkID(p, true);
		}
		else if(p === null)
		{
			result.id = null;
		}
		else try
		{
			Object.assign(result, p);
		}
		catch(_err)
		{
			continue;
		}
	}

	if(result.id !== null)
	{
		DEBUG.ID.set(result.id, result);
	}

	DEBUG.MAP.set(result.key, result);
	return result;
};

//
DEBUG.has = (_key) => {
	if(typeof _key === 'number')
	{
		return DEBUG.ID.has(_key);
	}

	if(typeof _key === 'string')
	{
		return DEBUG.MAP.has(_key);
	}

	return null;
};

DEBUG.count = () => DEBUG.MAP.size;
DEBUG.keys = () => [ ... DEBUG.MAP.keys() ];
DEBUG.values = () => [ ... DEBUG.MAP.values() ];

DEBUG.clear = () => {
	const result = [ ... DEBUG.MAP.values() ];
	DEBUG.MAP.clear(); DEBUG.ID.clear();
	return result;
};

DEBUG.set = (_key, _value, ... _param) => create(
	_key, _value, ... _param);

DEBUG.get = (_key, _raw = false) => {
	if(typeof _key === 'undefined')
	{
		return !!DEBUG.DEBUG;
	}

	if(!DEBUG.MAP.has(_key = checkKey(_key, false)))
	{
		if(DEBUG.DEBUG) throw new Error('There\'s no such item' +
			(typeof _key === 'string' ?
				' `' + _key + '`' : ''));
		return undefined;
	}
	
	const result = DEBUG.MAP.get(_key);
	if(!_raw) return result.value;
	return result;
};

DEBUG.raw = (_key) => DEBUG.get(_key, true);
DEBUG.id = (_key) => DEBUG.get(_key, true).id;

DEBUG.list = (_raw = false) => {
	const result = new Array(DEBUG.count());
	var index = 0;

	DEBUG.MAP.forEach((_value) => {
		if(_raw) result[index++] = { ... _value };
		else result[index++] = [
			_value.id,
			_value.key,
			_value.value,
			_value.desc ];
	});

	return result;
};

DEBUG.rawList = () => DEBUG.list(true);

DEBUG.remove = (_key) => {
	const result = DEBUG.MAP.get(_key = checkKey(_key, true));
	DEBUG.MAP.delete(_key);
	if(result.id !== null) DEBUG.ID.delete(result.id);
	return result;
};

//

