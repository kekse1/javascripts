/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v1.2.0
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
DEBUG.MAP = new Map();
export default DEBUG;

//
DEBUG.DEBUG = true; // 'base get() request' if undefined _key param.

//
const key = (_key) => _key;
const create = (_key, _value, ... _param) => {
	const result = {
		key: key(_key),
		value: _value,
		desc: null,
		hint: null,
		id: null
	};

	for(const p of _param)
	{
		if(typeof p === 'string')
		{
			if(result.desc === null)
			{
				result.desc = p;
			}
			else if(result.hint === null)
			{
				result.hint = p;
			}
		}
		else if(typeof p === 'number')
		{
			result.id = p;
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
	
	if(result.id !== null) DEBUG.MAP.forEach((_value, _key) => {
		if(_value.id === result.id)
		{
			throw new Error('The ID ' + (typeof _value.id === 'string' ?
				('`' + _value.id + '`') : _value.id.toString()) +
				' already exists.');
		}
	});

	return result; };

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
	const item = create(_key, _value, ... _param);
	DEBUG.MAP.set(item.key, item);
	return item;
};

DEBUG.get = (_key, _raw = false) => {
	if(typeof _key === 'undefined')
	{
		return !!DEBUG.DEBUG;
	}

	if(!DEBUG.MAP.has(_key = key(_key)))
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

DEBUG.remove = (_key) => {
	if(!DEBUG.MAP.has(_key = key(_key)))
	{
		if(DEBUG.DEBUG) throw new Error('There\'s no such item' +
			(typeof _key === 'string' ?
				' `' + _key + '`' : ''));
		return undefined;
	}
	
	const result = DEBUG.MAP.get(_key);
	DEBUG.MAP.delete(_key);
	return result;
};

//

