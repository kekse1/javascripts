/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://norbert.com.es/
 * v0.2.0
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

export default DEBUG;
DEBUG.MAP = new Map();

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

//
const file = (_file) => {
	if(!string(_file, false))
	{
		return null;
	}
	
	if(DEFAULT_LOWER_CASE)
	{
		_file = _file.toLowerCase();
	}
	
	if(DEFAULT_BASENAME)
	{
		return path.basename(_file);
	}
	
	return path.resolve(_file);
};

const name = (_name) => {
	if(!string(_name, false))
	{
		return null;
	}

	if(DEFAULT_UPPER_CASE)
	{
		return _name.toUpperCase();
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

DEBUG.add = (_file, _name, _value, _hint, ... _args) => {
	if(!(_name = name(_name)))
	{
		return;
	}
	
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
	
	const item = DEBUG.create(
		_file, _name, _value, _hint,
			... _args);
	
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

DEBUG.get = (_file, _name, _raw = false) => {
	if(!(_file = file(_file)))
	{
		return [ ... DEBUG.MAP.keys() ];
	}
	
	var map;
	
	if(DEBUG.MAP.has(_file))
	{
		map = DEBUG.MAP.get(_file);
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

