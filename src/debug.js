/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v1.5.0
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
 * NEW[v1.5.0]: according to `DEBUG.THROW` if `DEBUG.DEBUG`
 * 	[mode] is disabled, you can throw an exception like
 *	before, or we'll return the new DEFAULT VALUE you'd
 *	use in 'production'. :-)
 *	.. see the 'DEFAULT_THROW' (is set to (false) now);
 *	it's the default setting for the new `DEBUG.THROW`.
 *
 */

//
const DEFAULT_DEBUG = true;
const DEFAULT_THROW = false;

//
const DEBUG = (... _args) => {
	if(_args.length === 0)
	{
		return !!DEBUG.DEBUG;
	}

	if(typeof _args[0] === 'boolean')
	{
		if(_args[0] === !!DEBUG.DEBUG)
		{
			return false;
		}

		DEBUG.DEBUG = _args[0];
		return true;
	}

	if(_args.length > 1)
	{
		return DEBUG.set(... _args);
	}

	return DEBUG.get(... _args);
};

//
DEBUG.MAP = new Map();
DEBUG.ID = new Map();
export default DEBUG;

//
DEBUG.DEBUG = DEFAULT_DEBUG;
DEBUG.THROW = DEFAULT_THROW;

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

const create = (_key, _value, _default, ... _param) => {
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
		desc: '',
		key: _key,
		value: _value,
		default: _default };

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
	if(!DEBUG.DEBUG)
	{
		//if(DEBUG.THROW)
		//{
			return null;
		//}
	}

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

DEBUG.set = (_key, _value, _default, ... _param) => create(
	_key, _value, _default, ... _param);

DEBUG.get = (_key, _raw = false) => {
	if(typeof _key === 'undefined')
	{
		return !!DEBUG.DEBUG;
	}

	//it's very important to stay sure that
	//the debug values are correctly used!!
	if(!DEBUG.MAP.has(_key = checkKey(_key, false)))
	{
		throw new Error('There\'s no such item' +
			(typeof _key === 'string' ?
				' `' + _key + '`' : ''));
	}
	
	const result = DEBUG.MAP.get(_key);

	if(_raw) return Object.assign({
		DEBUG: !!DEBUG.DEBUG,
		THROW: !!DEBUG.THROW },
			result);
	
	if(DEBUG.DEBUG)
	{
		return result.value;
	}
	
	if(DEBUG.THROW)
	{
		throw new Error('DEBUG MODE is disabled!');
	}
	
	return result.default;
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

