/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v0.2.0
 *
 * A really old implementation, used that times in my < libjs.de > ... ^_^
 *
 * Helper to handle file modes, which are usually integers in the
 * `fs.Stats` of Node.js: < https://nodejs.org/dist/latest/docs/api/fs.html#class-fsstats >.
 *
 * It brings Linux file system (permission) feelings. ...
 *
 * PS: Without BIG tests (now); .. but it *should* work.
 *
 */

//
const mode = {};
export default mode;

//
Reflect.defineProperty(mode, 'valid', { enumerable: true, value: (_value, _parse = true) => {
	if(_parse && typeof _value === 'string' && _value.length === 10)
	{
		// is (true) correct here!?!?
		return mode.isValid(mode.parse(_value, true));
	}
	else if(typeof _value !== 'number')
	{
		return false;
	}
	
	return (_value >= 0 && _value <= 4095);
}});

Reflect.defineProperty(mode, 'octal', { enumerable: true, value: (_value) => {
	if(!mode.isValid(_value, false))
	{
		return null;
	}
	
	return (_value & 0o7777).toString(8);
}});

Reflect.defineProperty(mode, 'parse', { enumerable: true, value: (_string, _integer = false) => {
	if(typeof _string !== 'string' || _string.length !== 10)
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
	
	if(_string[0] === 'd')
	{
		result = '40' + result;
	}
	
	if(_integer)
	{
		result = parseInt(result, 8);
	}
	
	return result;
}});

Reflect.defineProperty(mode, 'render', { enumerable: true, value: (_mode) => {
	if(!mode.isValid(_mode, false))
	{
		if(typeof _mode === 'string' && _mode.length === 10)
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
	
	const modes = mode.regular;
	length = octal.length;
	var sub;
	
	for(var i = (length === 3 ? 0 : 1), j = 1; i < octal.length; ++i, j += 3)
	{
		sub = mode.special[Number(octal[0])];
		
		for(var i = 0, j = 3; i < sub.length; ++i, j += 3)
		{
			if(sub[i] !== ' ')
			{
				result.splice(j, 1, sub[i]);
			}
		}
	}

	return result.join('');
}});

Reflect.defineProperty(mode, 'regular', { enumerable: true, get: () => {
	return [ '---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx' ];
}});

Reflect.defineProperty(mode, 'special', { enumerable: true, get: () => {
	return [ '   ', '  t', ' s ', ' st', 's  ', 's t', 'ss ', 'sst' ];
}});

//
