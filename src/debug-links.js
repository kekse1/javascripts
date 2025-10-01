#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v0.3.0
 */

/*
 * Since I'm massively debugging my project(s) [see also my `debug.js` script],
 * I wanted a way to *automatically* create my debug symlinks: all possible
 * constellations, when I've got a number of debug variables that can be set
 * to small integer values or smth.
 *
 * When I argue with the mask `2,1`, the symbolic links this script *could*
 * generate (or just output them on screen) are [ 0,0; 0,1; 1,0; 1,1; 2,0; 2,1 ];
 *
 */

//
const DEFAULT_ALLOW_ZERO = true;

//
import * as globals from '../shared/globals.js';
import * as server from '../shared/server.js';
import fs from 'node:fs';

//
const syntax = (_exit = 255) => {
	console.warn('Debugging my `Norbert`.');
	console.info(EOL + '\tSyntax: $0 < mask > [ < symlink target > [ < extension > ] ]');
	console.debug(EOL + 'If only mask is given, you\'ll only see the valid constellations (on screen).');
	console.debug('Otherwise notice that symlinks will be created in/from current working directory.');
	if(byte(_exit)) process.exit(_exit);
};

var mask = process.argv[2];
var target, extension;

if(process.argv.length <= 3)
{
	target = extension = null;
}
else
{
	target = process.argv[3];
	extension = process.argv[4];

	if(!pathname(target) || !fs.existsSync(target))
	{
		syntax(1);
	}

	if(!string(extension, false))
	{
		extension = '';
	}
	else if(extension[0] !== '.')
	{
		extension = '.' + extension;
	}
}

const checkMask = (_mask, _throw = true) => {
	if(!string(_mask, false))
	{
		if(_throw)
		{
			return syntax(2);
		}

		return null;
	}

	_mask = _mask.split(',');

	for(var i = 0; i < _mask.length; ++i)
	{
		_mask[i] = Number(_mask[i]);
		
		if(Number.isNaN(_mask[i]))
		{
			if(_throw)
			{
				return syntax(3);
			}
			
			return null;
		}
		
		if(!DEFAULT_ALLOW_ZERO && _mask[i] === 0)
		{
			if(_throw)
			{
				return syntax(4);
			}
			
			return null;
		}
		
		++_mask[i];
	}

	return _mask;
};

if(target) target = path.relative(
	process.cwd(), path.resolve(target));
const orig = mask;
mask = checkMask(mask, true);

const countLinks = (_mask) => {
	var result = 1;

	for(var i = 0; i < _mask.length; ++i)
	{
		result *= _mask[i];
	}

	return result;
};

const count = countLinks(mask);

const proceed = () => {
	var sub, base, digit, rest;
	const result = [];

	for(var i = 0, k = 0; i < count; ++i)
	{
		sub = '';
		rest = i;

		for(var j = mask.length - 1; j >= 0; --j)
		{
			sub = Math.floor(rest % mask[j]) +
				(sub ? ',' : '') + sub;
			rest /= mask[j];
		}

		result[k++] = sub;
	}

	if(result.length === 0)
	{
		console.error('Unexpected...');
		return process.exit(5);
	}

	return finish(result);//.sort(true);//!?
};

const finish = (_list) => {
	console.eol();

	if(!target)
	{
		for(const item of _list)
		{
			console.log(item);
		}

		process.exit();
	}

	for(const item of _list)
	{
		fs.symlinkSync(target,
			path.join(process.cwd(), item + extension));
		console.log('./' + item + extension);
	}

	console.log(EOL + 'Finished.. just created ' +
		_list.length.toLocaleString().bold(true).info(true) +
		' symbolic links to ' + target.bold(true).error(true).quote() + '!');
	process.exit();
};

//
console.log('OK, with your mask ' + orig.quote().info(true).bold(true) +
	' we\'re about to create ' + count.toLocaleString().warn(true).bold(true) +
	' ' + (target === null ? ('debug file constellations '.defaultFG(true) +
	'(on screen)'.debug(true)) : 'symbolic links to '.defaultFG(true) +
	target.quote().error(true) + ' with the extension ' +
	extension.quote().bold(true).debug(true)) + '!');
if(target) console.confirm('Do you want to continue?', (_response) => {
	if(_response) return proceed();
	console.error('OK, we\'re aborting here..!');
	process.exit(true); });
else proceed();

//

