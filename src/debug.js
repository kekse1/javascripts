/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v0.2.4
 */

/*
 * This code is an example on how you could handle DEBUG switches.
 *
 * I've many files with many switches. But instead of distributing
 * all of them in all files, I needed a global place (and some
 * management functions, too); so it'd be easier to run my apps
 * with different test/debug/.. cases!
 *
 * So this little JavaScript code was born. .. maybe it could be
 * a helping hand for you, too!? ^_^ ...
 *
 */

//
const DEFAULT_BASENAME = true;
const DEFAULT_LOWER_CASE = true;
const DEFAULT_UPPER_CASE = true;
const DEFAULT_RADIX = 36;
const DEFAULT_COUNT_PREFIX = 'DEBUG_';
const DEFAULT_COUNT_LOCAL = true;
const DEFAULT_EXT = '.js';

//
const DEBUG = (_func, ... _a) => {
	if(!string(_func, false))
	{
		return DEBUG.FUNC();
	}

	if(!(_func in DEBUG))
	{
		return DEBUG.FUNC();
	}
	
	return DEBUG[_func](... _a);
};

export default DEBUG; DEBUG.MAP = new Map();
DEBUG.COUNT_GLOBAL = 0; DEBUG.COUNT_LOCAL = new Map();

const count = (_file = null) => {
	if(!(_file = file(_file)))
	{
		return name((string(DEFAULT_COUNT_PREFIX, false) ?
				DEFAULT_COUNT_PREFIX : '') +
			(++DEBUG.COUNT_GLOBAL).toString(
				DEFAULT_RADIX));
	}

	if(!DEBUG.COUNT_LOCAL.has(_file))
	{
		DEBUG.COUNT_LOCAL.set(_file, 0);
	}
	else
	{
		DEBUG.COUNT_LOCAL.set(_file,
			(DEBUG.COUNT_LOCAL.get(_file) + 1));
	}

	return name((string(DEFAULT_COUNT_PREFIX, false) ?
			DEFAULT_COUNT_PREFIX : '') +
		DEBUG.COUNT_LOCAL.get(_file).toString(
			DEFAULT_RADIX));
};

//
DEBUG.FUNC = () => {
	const result = [];
	const keys = Object.keys(DEBUG);
	
	for(var i = 0, j = 0; i < keys.length; ++i)
	{
		if(keys[i] === 'FUNC' || keys[i] === 'create')
		{
			continue;
		}
		
		if(func(DEBUG[keys[i]]))
		{
			result[j++] = keys[i];
		}
	}
	
	return result;
};

DEBUG.reset = (_clear = true) => {
	if(_clear) DEBUG.MAP = new Map();
	DEBUG.COUNT = 0; };

//
const file = (_file) => {
	if(!string(_file, false))
	{
		return null;
	}

	_file = path.normalize(_file);
	
	if(DEFAULT_LOWER_CASE)
	{
		_file = _file.toLowerCase();
	}
	
	if(DEFAULT_BASENAME)
	{
		_file = path.basename(_file);
	}

	if(DEFAULT_EXT && !path.extname(_file))
	{
		_file += (DEFAULT_EXT[0] === '.' ?
			'' : '.') + DEFAULT_EXT;
	}
	
	return _file;
};

const name = (_name) => {
	if(int(_name))
	{
		_name = _name.toString(
			DEFAULT_RADIX);
	}
	else if(!string(_name, false))
	{
		return null;
	}

	if(DEFAULT_UPPER_CASE)
	{
		_name = _name.toUpperCase();
	}

	return _name;
};

DEBUG.count = (_file) => {
	if(!(_file = file(_file)))
	{
		return DEBUG.MAP.size;
	}
	
	if(DEBUG.MAP.has(_file))
	{
		return DEBUG.MAP.get(_file).size;
	}
	
	return 0;
};

DEBUG.has = (_file, _name) => {
	if(!(_file = file(_file)))
	{
		return null;
	}
	
	if(DEBUG.MAP.has(_file))
	{
		if(_name = name(_name))
		{
			return DEBUG.MAP.get(_file).
				has(_name);
		}
		
		return true;
	}
	
	return false;
};

DEBUG.set = (_file, _name, _value, _hint, ... _args) => {
	if(!(_file = file(_file)))
	{
		return null;
	}
	
	var map;
	
	if(!DEBUG.MAP.has(_file = file(_file)))
	{
		DEBUG.MAP.set(_file,
			map = new Map());
	}
	else
	{
		map = DEBUG.MAP.get(_file);
	}
	
	const item = DEBUG.create(_file,
		_name = name(_name),
		_value, _hint, ... _args);

	if(!(item.name = name(item.name)))
	{
		item.name = _name = (
			DEFAULT_COUNT_LOCAL ?
				item.local : item.global);
	}
	
	if(map.has(_name))
	{
		item.original = map.get(_name);
		
		if(_raw)
		{
			item.original =
				item.original.value;
		}
	}
	
	map.set(_name, item);
	return item;
};

DEBUG.get = (_file, _name, _raw = true, _throw = true) => {
	if(!(_file = file(_file)))
	{
		return [ ... DEBUG.MAP.keys() ];
	}
	
	var map;
	
	if(DEBUG.MAP.has(_file))
	{
		map = DEBUG.MAP.get(_file);
	}
	else if(_throw)
	{
		throw new Error('File not available');
	}
	else
	{
		return undefined;
	}

	if(!(_name = name(_name)))
	{
		const keys = [ ... map.keys() ];
		const result = {};
		
		var item; for(const key of keys)
		{
			item = map.get(key);
			
			if(_raw)
			{
				item = item.value;
			}
			
			result[key] = item;
		}
		
		return result;
	}
	
	if(!map.has(_name))
	{
		if(_throw)
		{
			throw new Error('Name not available in file');
		}

		return undefined;
	}
	
	const result = map.get(_name);
	
	if(_raw)
	{
		return result.value;
	}
	
	return result;
};

DEBUG.create = (_file, _name, _value, _hint, ... _args) => {
	return {	file: (file(_file) || null),
			name: (name(_name) || null),
			value: (_value || undefined),
			hint: (_hint || null),
			original: undefined,
			global: count(null),
			local: count(_file),
			args: _args };
};

DEBUG.list = (_file) => {
	if(!(_file = file(_file)))
	{
		return [ ... DEBUG.MAP.keys() ];
	}
	
	if(DEBUG.MAP.has(_file))
	{
		return [ ... DEBUG.MAP.get(_file).keys() ];
	}
	
	return null;
};

DEBUG.find = (_name, _raw = false) => {
	if(!(_name = name(_name)))
	{
		_name = null;
	}

	const files = [ ... DEBUG.MAP.keys() ];
	const result = []; const object = {};
	var map, keys, item;
	
	for(var i = 0, z = 0; i < files.length; ++i)
	{
		map = DEBUG.MAP.get(files[i]);
		
		if(_name)
		{
			if(map.has(_name))
			{
				item = map.get(_name);
				
				if(_raw)
				{
					object[files[i]] = item.value;
				}
				else
				{
					result[z++] = item;
				}
			}
		}
		else
		{
			keys = [ ... map.keys() ];
		
			for(var j = 0; j < keys.length; ++j)
			{
				item = map.get(keys[j]);
				
				if(_raw) item = [
					files[i], keys[j],
					item.value ];

				result[z++] = item;
			}
		}
	}
	
	if(_name && _raw)
	{
		return object;
	}
	
	return result;
};

DEBUG.search = (_local = null, ... _count) => {
	for(var i = 0; i < _count.length; ++i)
	{
		if(int(_count[i]))
		{
			_count[i] = name(
				_count[i].toString(
					DEFAULT_RADIX));
		}
		else if(string(_count[i]))
		{
			_count[i] = name(_count[i]);
		}
		else
		{
			_count.splice(i--, 1);
			continue;
		}
		
		if(string(DEFAULT_COUNT_PREFIX, false) &&
			!_count[i].startsWith(DEFAULT_COUNT_PREFIX))
		{
			_count[i] = DEFAULT_COUNT_PREFIX + _count[i];
		}
	}

	if(_count.length === 0)
	{
		_count = null;
	}
	else
	{
		_count = _count.unique();
	}

	const result = [];
	const values = [ ... DEBUG.MAP.values() ];
	var map, sub;
	
	for(var i = 0, z = 0; i < values.length; ++i)
	{
		sub = [ ... (map = values[i]).values() ];
		
		for(var j = 0; j < sub.length; ++j)
		{
			if(_count === null)
			{
				result[z++] = sub[j];
			}
			else if(_local === null)
			{
				if(_count.includes(
						sub[j].global) ||
					_count.includes(
						sub[j].local))
				{
					result[z++] = sub[j];
				}
			}
			else if(_local)
			{
				if(_count.includes(
					sub[j].local))
				{
					result[z++] = sub[j];
				}
			}
			else
			{
				if(_count.includes(
					sub[j].global))
				{
					result[z++] = sub[j];
				}
			}
		}
	}
	
	return result;
};

DEBUG.clear = () => {
	return DEBUG.MAP = new Map();
};

DEBUG.remove = (_file, _name = null) => {
	if(!(_file = file(_file)))
	{
		return;
	}
	
	if(DEBUG.MAP.has(_file))
	{
		const map = DEBUG.MAP.get(_file);
		var result;
		
		if(_name = name(_name))
		{
			if(map.has(_name))
			{
				result = map.get(_name);
				map.delete(_name);

				if(map.size === 0)
				{
					DEBUG.MAP.delete(_file);
				}
			}
			
			return result;
		}
		else
		{
			const keys = [ ... map.keys() ];
			result = {};

			for(const key of keys)
			{
				result[key] = map.get(key);
			}

			DEBUG.MAP.delete(_file);
		}
		
		return result;
	}
};

//

