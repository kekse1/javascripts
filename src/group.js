#!/usr/bin/env node

/*
 * Copyright (c) Sebastian kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/
 * v0.1.2
 */
 
/*
 * TODO * ich wuerde symlinks, die nicht dereferenziert
 *	werden (see --resolve), in ihrem target anpassen?!11 ^_^
 *	... sowohl kopierte als auch verschobene... falls sie
 *		denn relativer pfad-natur sind. ...
 *	WIRD ATM schon automatisch gemacht, ..
 *		... ABER NED SO SCHOEN..!1 ;-/
 */

//
import * as globals from '../shared/globals.js';
import * as server from '../shared/server.js';
import getopt from '../shared/getopt.js';
import fs from 'node:fs';

//
const args = getopt({
	array: false,
	unescape: true,
	castRegular: false,
	equalAssign: true,
	regexp: false,
	cast: true
});

args.ITEM = [
	[ '--count', undefined ],
	[ '--copy', false ],
	[ '--relative', true ],
	[ '--start', 0 ],
	[ '--resolve', false ]
];

args.ITEM.sort(true);

//
const syntax = (_exit) => {
	//
	console.log('Will copy or move (depends on parameter)' + EOL +
		'all file system entries that you can' + EOL +
		'with on your command line.' + eol(2) + 'It\'s possible to ' +
		'selected all files ' + EOL + 'with the default glob char `' +
		'*'.error() + '`, e.g.'.faint() + EOL);

	//
	console.log('Parameters' + (' (those w/o defaults' +
		' are ' + 'necessary'.bold() + ')').debug() +
		':'.defaultFG() + EOL);

	//
	const max = { key: 0 };
	
	var len; for(const i of args.ITEM)
	{
		if((len = i[0].length) > max.key)
		{
			max.key = len;
		}
	}
	
	var line; for(const i of args.ITEM)
	{
		line = '\t' + i[0].padStart(max.key, ' ');
		
		if(typeof i[1] !== 'undefined')
		{
			line += ('  ('.debug() + i[1].
				toString().info() +
				')'.debug());
		}
		
		console.log(line);
	}
	
	console.eol();
	
	//
	if(byte(_exit))
	{
		process.exit(_exit);
	}
};

//
if(args.help)
{
	syntax(0);
}

if(args.length === 0)
{
	syntax(1);
}

//
const COUNT = args.get('count');

if(!int(COUNT) || COUNT < 1)
{
	console.error('Invalid `' + '--count'.warn() +
		'` parameter!'.error());
	syntax(2);
}

const COPY = (args.has('copy', 'boolean') ?
		args.get('copy') : false);
const RELATIVE = (args.has('relative', 'boolean') ?
		args.get('relative') : true);
const START = (args.has('start', 'integer') ?
		args.get('start') : 0);
const RESOLVE = (args.has('resolve', 'boolean') ?
		args.get('resolve') : false);

//
var items = [];

var item; for(var i = 0, j = 0; i < args.length; ++i)
{
	if(path(item = args[i]))
	{
		items[j++] = item;
	}
}

if(items.length === 0)
{
	syntax(3);
}

const result = [];

for(var i = 0, j = 0; i < items.length; ++i)
{
	if(fs.existsSync(items[i] = path.resolve(items[i])))
	{
		result[j++] = items[i];
	}
	else
	{
		console.warn('Item[' + i + '] doesn\'t exist:');
		console.debug('\t' + items[i]);
	}
}

items = null;

if(result.length === 0)
{
	syntax(4);
}

const BLOCKS = Math._ceil(
	result.length / COUNT);
const PAD = (START + BLOCKS).
	toString().length;

//
const proceed = (_yes = true) => {
	if(!_yes)
	{
		return process.exit(true);
	}
	
	var	cycle = (START - 1),
		count = -1,
		stats;

	var line, res, target; for(const item of result)
	{
		res = null;
		target = process.cwd();
		
		if((++count % COUNT) === 0)
		{
			target = path.join(target,
				(++cycle).toString().
				padStart(PAD, '0'));

			stats = fs.statSync(target, {
				throwIfNoEntry: false });
		
			if(stats)
			{
				if(!stats.isDirectory())
				{
					console.error('The target path `' +
						target.warn() + '` already exists, ' +
						'but not as a directory.');
					res = false;
				}
			}
			else try
			{
				fs.mkdirSync(target, {
					recursive: true });
			}
			catch(_err)
			{
				console.error('Unable to create the target directory `' +
					target.warn() + '`.');
				res = false;
			}
		}
		else
		{
			target = path.join(target,
				cycle.toString().
				padStart(PAD, '0'));
		}
		
		target = path.join(target, path.
				basename(item));
		
		line = getPath(target).defaultFG();

		if(res === null)
		{
			if(fs.existsSync(target))
			{
				console.error('This target path already exists: `' +
					target.warn() + '`'.error());
				res = false;
			}
			else if(COPY) try
			{
				fs.cpSync(item, target, {
					recursive: true,
					dereference: RESOLVE });
				res = true;
			}
			catch(_err)
			{
				res = false;
			}
			else try
			{
				fs.renameSync(item, target);
				res = true;
			}
			catch(_err)
			{
				res = false;
			}
		}

		if(res)
		{
			line = ('('.debug() + 'good'.info() + ')'.
				debug() + '    ' + line);
		}
		else
		{
			line = ('('.debug() + 'fail'.error() + ')'.
				debug() + '    ' + line);
		}
		
		console.log(line);
	}
};

const getPath = (_path) => {
	if(RELATIVE) return path.relative(
		process.cwd(), path.
		resolve(_path));
	return path.resolve(_path);
};

//
console.info('I\'d try to move ' +
	result.length.toLocaleString().
	error() + ' items, into ' +
	BLOCKS.toLocaleString().
	error() + ' directory blocks.'.
	info());

//
console.confirm('Do you really want to ' +
	(COPY ? 'copy'.error() : 'move'.warn()) +
	' these items', proceed);

//
