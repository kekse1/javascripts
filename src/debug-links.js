#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v0.4.0
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
 * NEW[v0.4.0]: optionally you can label your variables in the mask (`one=1,two=2`);
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

const label = [];
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

	var idx, temp; for(var i = 0; i < _mask.length; ++i)
	{
		if((idx = _mask[i].lastIndexOf('=')) > -1)
		{
			temp = _mask[i].substr(0, idx);
			
			if(label.includes(temp))
			{
				return syntax(6);
			}
			
			label[i] = temp;
			_mask[i] = _mask[i].substr(idx + 1);
		}
		else
		{
			label[i] = '';
		}
		
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

		if(_mask[i] < 0)
		{
			if(_throw)
			{
				return syntax(5);
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
	var sub = [], base, digit, rest;
	const result = [];

	for(var i = 0, k = 0; i < count; ++i)
	{
		rest = i;

		for(var j = mask.length - 1; j >= 0; --j)
		{
			sub.unshift(Math._floor(rest % mask[j]));
			
			if(label[j])
			{
				sub[0] = label[j] + '=' + sub[0];
			}
			
			rest /= mask[j];
		}

		result[k++] = sub.join(',');
		sub.length = 0;
	}

	if(result.length === 0)
	{
		console.error('Unexpected...');
		return process.exit(6);
	}

	return finish(result);
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

	var existed = 0, created = 0;

	var p; for(const item of _list)
	{
		p = path.join(process.cwd(), item + extension);

		if(fs.existsSync(p))
		{
			++existed;
			p = path.basename(p);
			console.warn('Already existed: ' + p.quote());
			continue;
		}

		fs.symlinkSync(target, p);
		p = path.relative(process.cwd(), p);
		console.log(p);
		++created;
	}

	if(created)
	{
		console.info(EOL + 'Finished.. just created ' +
			created.toLocaleString().bold(true).warn(true) +
			' symbolic links to ' + target.error(true).quote() + '!');
		if(existed) console.warn('But ' + existed.toLocaleString().
			bold(true).error(true) + ' file' + (existed === 1 ? '' : 's') +
				' already existed!');
	}
	else console.error(EOL + 'All ' + _list.length.toLocaleString().
		bold(true).warn(true) + ' files already existed!');

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

