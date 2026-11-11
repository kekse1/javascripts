/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v1.6.3
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
import * as globals from './globals.js';

//
const
	DEFAULT_CHECK = true,
	DEFAULT_DEBUG = true,
	DEFAULT_THROW = false,
	DEFAULT_ENV = true,
	DEFAULT_ENV_KEY = '_DEBUG_';

//
const
	DEFAULT_CAST_REGEXP = false,
	DEFAULT_CAST_EMPTY = true,
	DEFAULT_CAST_ARRAY = true;

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
DEBUG.ENV = DEFAULT_ENV;
DEBUG.ENV_KEY = DEFAULT_ENV_KEY;

//
DEBUG.checkEnvironment = (_force = false, _print = true, _throw = true) => {
	if(!DEFAULT_CHECK && !_force)
	{
		return false;
	}

	if(!DEBUG.ENV || !DEBUG.ENV_KEY)
	{
		return false;
	}
	
	const	result = [],
		KEY = DEBUG.ENV_KEY,
		keys = new Set(DEBUG.keys()),
		env = Object.keys(process.env);
	var	total = 0, valid = 0;
	
	var key; for(var i = 0, j = 0; i < env.length; ++i)
	{
		if(!(key = env[i]).startsWith(KEY))
		{
			continue;
		}
		
		if(!(key = key.substr(KEY.length)))
		{
			continue;
		}
		
		if(!keys.has(key))
		{
			result[j++] = key;
		}
		else
		{
			++valid;
		}
		
		++total;
	}
	
	if(_print && total > 0)
	{
		console.debug(EOL + ' ['.debug() + 'INFO'.info() + ']'.debug() +
			' There are ' + total.toLocaleString().bold().warn() +
			' debug '.bold().error() + 'environment'.debug().
			underline() + ' variables set (in total), '.debug() +
			valid.toLocaleString().bold().info() + ' ' +
			(valid === 1 ? 'is' : 'are') + ' ' + 'valid'.info().
			underline() + '!'.debug());

		if(_throw && result.length > 0)
		{
			console.error('['.debug() + 'ERROR'.error().bold() + ']'.debug() +
				' You\'ve set ' + result.length.toLocaleString().warn().bold() +
				' undefined '.error().bold() + '`'.debug() + DEBUG.ENV_KEY.
				warn() + '*'.info() + '`'.debug() + ' environment keys'.
				error() + ' (out of '.debug() + keys.size.toLocaleString().
				bold().info() + ' in total)'.debug() + ':'.error() + EOL);
			
			for(const i of result)
			{
				console.error('\t' + '>> '.debug() +
					'`'.warn() + i.error() + '`'.warn());
			}
			
			console.eol();
		}
	}

	if(result.length === 0)
	{
		return true;
	}

	return result;
};


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
	
	var	replaces = _value,
		rewrite;
	const	envKey = DEBUG.getFullEnvKey(_key);
	
	if(DEBUG.ENV && DEBUG.hasEnvKey(_key))
	{
		try
		{
			_value = process.env[envKey].tryCast(
				DEFAULT_CAST_REGEXP,
				DEFAULT_CAST_EMPTY,
				DEFAULT_CAST_ARRAY);
			rewrite = true;
		}
		catch(_err)
		{
			rewrite = null;
			replaces = undefined;
		}
	}
	else
	{
		rewrite = false;
		replaces = undefined;
	}

	const result =			{
		id: null,
		desc: '',
		key: _key,
		value: _value,
		rewrite, replaces,
		default: _default	};

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
DEBUG.getFullEnvKey = (_key) => {
	if(!DEBUG.ENV_KEY) return null;
	if(_key.startsWith(DEBUG.ENV_KEY)) return _key;
	return (DEBUG.ENV_KEY + _key);
};

DEBUG.hasEnvKey = (_key) => {
	if(!DEBUG.ENV_KEY) return null;
	return (DEBUG.getFullEnvKey(_key) in process.env);
};

DEBUG.hasEnv = () => {
	if(!DEBUG.ENV_KEY) return null;
	return (DEBUG.ENV_KEY in process.env);
};

DEBUG.getEnvKey = (_key) => {
	if(!DEBUG.ENV_KEY) return null;
	if(!_key.startsWith(DEBUG.ENV_KEY)) return _key;
	return _key.substr(DEBUG.ENV_KEY.length);
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
	const result = new Array(DEBUG.size);
	var index = 0;

	DEBUG.MAP.forEach((_value) => {
		if(_raw)	result[index++] =
					{ ... _value };
		else		result[index++] =		[
					_value.id,
					_value.key,
					_value.value,
					_value.rewrite,
					_value.replaces,
					_value.desc		];
	});

	return result;
};

DEBUG.rewrites = (_raw = false) => {
	const result = new Array(DEBUG.size);
	var index = 0;
	
	DEBUG.MAP.forEach((_value) => {
		if(!_value.rewrite) return;
		if(_raw)	result[index++] =
					{ ... _value };
		else		result[index++] =
					_value.key;
	});
	
	return result;
};

DEBUG.rawRewrites = () => DEBUG.rewrites(true);
DEBUG.rawList = () => DEBUG.list(true);

DEBUG.map = (_force = false) => {
	const result = {};
	const type = ((DEBUG.DEBUG || _force) ?
			'value' : 'default');

	for(const item of DEBUG.MAP)
	{
		result[item[0]] = item[1][type];
	}
	
	return result;
};

//
DEBUG.remove = (_key) => {
	const result = DEBUG.MAP.get(_key = checkKey(_key, true));
	DEBUG.MAP.delete(_key);
	if(result.id !== null) DEBUG.ID.delete(result.id);
	return result;
};

//
const tryCast = (_value) => {
	if(typeof _value !== 'string')
	{
		return _value;
	}

	if(_value.length === 0)
	{
		return true;
	}

	if(!isNaN(_value))
	{
		return Number(_value);
	}

	var temp = _value.slice(0, -1);

	if(_value[_value.length - 1] === 'n' && !isNaN(temp))
	{
		return BigInt(temp);
	}

	if(_value.length <= 9) switch(_value.toLowerCase())
	{
		case 'no': case 'false': case 'off': return false;
		case 'yes': case 'true': case 'on': return true;
		case 'null': return null;
		case 'undefined': return undefined;
	}

	return _value;
};

//
