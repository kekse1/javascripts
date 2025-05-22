/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v0.3.2
 *
 * A really old implementation, used that times in my < libjs.de > ... ^_^
 *
 * Helper to handle file modes, which are usually integers in the
 * `fs.Stats` of Node.js: < https://nodejs.org/dist/latest/docs/api/fs.html#class-fsstats >
 *
 * It brings Linux file system (permission) feelings. ...
 *
 */

/*
 * TODO: the new types also in 'parse()', 'render()', etc.!
 * TODO: and the '.type()' w/ 'isValid()' ETC..
 */

//
const mode = {};
export default mode;

//
Reflect.defineProperty(mode, 'valid', { enumerable: true, value: (_value, _parse = true) => {
	if(_parse && typeof _value === 'string')
	{
		if(_value.length === 9 || _value.length === 10)
		{
			return mode.valid(mode.parse(_value, true));
		}

		return false;
	}

	return ((typeof _value === 'number') && _value >= 0);
}});

Reflect.defineProperty(mode, 'octal', { enumerable: true, value: (_value) => {
	if(!mode.valid(_value, false))
	{
		return null;
	}
	
	return (_value & 0o7777).toString(8);
}});

Reflect.defineProperty(mode, 'parse', { enumerable: true, value: (_string, _integer = false) => {
	if(typeof _string === 'number' && _string >= 0)
	{
		return _string;
	}
	else if(typeof _string !== 'string')
	{
		return null;
	}

	const nine = (_string.length === 9);

	if(nine)
	{
		_string = '-' + _string;
	}
	else if(_string.length !== 10)
	{
		return null;
	}
	
	var result = '';
	var mode, specialMode = 0;
	
	for(var i = _string.length - 1, l = 0; i > 0; ++l)
	{
		mode = 0;
		
		for(var j = i, k = 0; j > 0 && k < 3; --j, ++k, --i) switch(_string[j])
		{
			case 't':
				if(l === 0)
				{
					specialMode += 1;
				}
				
				mode += 1;
				break;
			case 's':
				if(l === 1)
				{
					specialMode += 2;
				}
				else
				{
					specialMode += 4;
				}
				
				mode += 1;
				break;
			case 'x':
				mode += 1;
				break;
			case 'w':
				mode += 2;
				break;
			case 'r':
				mode += 4;
				break;
		}
		
		result = mode.toString(8) + result;
	}
	
	if(specialMode > 0)
	{
		result = specialMode.toString(8) + result;
	}
	else
	{
		result = result.padStart(4, '0');
	}
	
	if(nine)
	{
		result = result.substr(1);
	}
	else if(_string[0] === 'd')
	{
		result = '40' + result;
	}
	
	if(_integer)
	{
		result = parseInt(result, 8);
	}
	
	return result;
}});

Reflect.defineProperty(mode, 'render', { enumerable: true, value: (_mode, _perm = false) => {
	if(!mode.valid(_mode, false))
	{
		if(typeof _mode === 'string' &&
			(_mode.length === 9 || _mode.length === 10))
		{
			return _mode;
		}
		
		return null;
	}
	
	var octal = _mode.toString(8).padStart(3, '0');
	const result = new Array(10);
	for(var i = 0; i < result.length; ++i) result[i] = [''];
	var length = octal.length;
	
	if(length === 4 && octal[0] === '0')
	{
		octal = octal.substr(1);
	}
	else if(length > 4)
	{
		if(octal[0] === '4')
		{
			result[0] = 'd';
		}
		else
		{
			result[0] = '-';
		}
		
		if((octal = octal.substr(-4)).length === 4 && octal[0] === '0')
		{
			octal = octal.substr(1);
		}
	}
	else
	{
		result[0] = '-';
	}
	
	const modes = mode.REGULAR;
	length = octal.length;
	var sub;
	
	for(var i = (length === 3 ? 0 : 1), j = 1; i < octal.length; ++i, j += 3)
	{
		result.splice(j, 3, ... modes[Number(octal[i])].split(''));
	}

	if(length === 4)
	{
		sub = mode.SPECIAL[Number(octal[0])];
		
		for(var i = 0, j = 3; i < sub.length; ++i, j += 3)
		{
			if(sub[i] !== ' ')
			{
				result.splice(j, 1, sub[i]);
			}
		}
	}

	if(_perm)
	{
		result.shift();
	}

	return result.join('');
}});

//
//todo/isvalid, etc..
//
Reflect.defineProperty(mode, 'type', { enumerable: true, value: (_mode, _long = null) => {
	const result = (_mode & 0o170000);

	if(_long === null)
	{
		return result;
	}

	const mask = mode.MASK;
	
	for(var i = 0; i < mask.length; ++i)
	{
		if(mask[i] === result)
		{
			if(_long)
			{
				return mode.TYPES[i];
			}

			return mode.TYPE[i];
		}
	}
	
	return '';
}});

Reflect.defineProperty(mode, 'REGULAR', { enumerable: true, get: () => {
	return [ '---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx' ];
}});

Reflect.defineProperty(mode, 'SPECIAL', { enumerable: true, get: () => {
	return [ '   ', '  t', ' s ', ' st', 's  ', 's t', 'ss ', 'sst' ];
}});

Reflect.defineProperty(mode, 'TYPE', { enumerable: true, get: () => {
	return [ 'p', 'c', 'd', 'b', '-', 'l', 's' ];
}});

Reflect.defineProperty(mode, 'TYPES', { enumerable: true, get: () => {
	return [
		'fifo',
		'char',
		'directory',
		'block',
		'file',
		'symlink',
		'socket' ];
}});

Reflect.defineProperty(mode, 'MASK', { enumerable: true, get: () => {
	return [
		0x1000,	// fifo
		0x2000,	// char
		0x4000,	// directory
		0x6000,	// block
		0x8000,	// regular
		0xA000,	// symlink
		0xC000	// socket
	];
}});

//
