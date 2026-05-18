#!/usr/bin/env node

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/
 * v0.1.3
 */
 
/*
 * das hier ist die EASY variante.. eine bessere loesung zur
 * link-extraktion siehe `links.js`!1
 */
 
//
const DEFAULT_BUFFER = (1024 * 64);
const DEFAULT_SEPARATORS = [ '\'', '"', '`' ];
const DEFAULT_IGNORE_COMMENTS = true;
const DEFAULT_OFFSET_GET_INDEX = true;
const DEFAULT_UNIQUE_HOST = true;

//
Reflect.defineProperty(Math, 'getIndex', { value: (_index, _length) => {
	if(_length < 1)
	{
		return null;
	}
	else if((_index %= _length) < 0)
	{
		_index = ((_length + _index) % _length);
	}
	
	return (_index || 0);
}});

Reflect.defineProperty(String.prototype, 'at', { value: function(_offset, _compare, _case_sensitive = false)
{
	if(DEFAULT_OFFSET_GET_INDEX)
	{
		_offset = Math.getIndex(_offset, this.length);
	}

	var data = this.substr(_offset, _compare.length);
	
	if(typeof _compare === 'number')
	{
		return this.substr(_offset, _compare);
	}
	
	if(!_case_sensitive)
	{
		_compare = _compare.toLowerCase();
		data = data.toLowerCase();
	}

	return (data === _compare);
}});

//
import os from 'node:os';
import fs from 'node:fs';

//
const help = (_exit = null) => {
	console.log(os.EOL + 'Syntax: $0 < input.html > < output.txt > ' +
		'[ < base href/url > ]' + os.EOL);
	if(_exit !== null) process.exit(_exit);
};

//
for(var i = 2; i < process.argv.length; ++i)
{
	if(process.argv[i] === '-?' || process.argv[i] === '-h' || process.argv[i] === '--help')
	{
		help(0);
	}
}

//
const INPUT = process.argv[2];
const OUTPUT = process.argv[3];
var BASE = process.argv[4];

if(! (INPUT && OUTPUT))
{
	help(1);
}

if(!fs.existsSync(INPUT))
{
	console.error('ERROR: Input file doesn\'t exist!');
	process.exit(2);
}

if(fs.existsSync(OUTPUT))
{
	console.error('ERROR: Output file already exists!');
	process.exit(3);
}

if(!BASE)
{
	console.warn('WARNING: Without the 3rd argument (a base href/url) ' +
		'not all links will get proper, valid URLs.' + os.EOL);
	BASE = null;
}
else try
{
	BASE = new URL(BASE).href;
}
catch(_err)
{
	console.error('WARNING: Your (optional) 3rd argument (a base href/url) is not a valid URL!');
	process.exit(4);
}

//
var inputSize = 0, outputSize = 0, errors = 0, empty = 0, multiple = 0;
var TIME = Date.now(); const RESULT = [];

//
const chunk = (_chunk) => handleData(_chunk);
const end = () => { stream.close(); finish(); };

var stream = fs.createReadStream(INPUT, {
	encoding: 'utf8',
	autoClose: true, emitClose: true,
	highWaterMark: DEFAULT_BUFFER });

stream.on('data', chunk);
stream.once('end', end);

//
const HOST = new Set();
const NEEDLE = ' href=', COMMENTS = [ '<!--', '-->' ];
var HREF = null, SEP = null, COMMENT = false;

const pushURL = (_href) => {
	if(!_href)
	{
		return ++empty;
	}
	
	if(BASE) try
	{
		_href = new URL(_href, BASE).href;
	}
	catch(_err)
	{
		return ++errors;
	}
	
	if(DEFAULT_UNIQUE_HOST) try
	{
		_href = new URL(_href);

		if(HOST.has(_href.host))
		{
			return ++multiple;
		}

		HOST.add(_href.host);
		_href = _href.href;
	}
	catch(_err)
	{
		++errors;
	}
	
	RESULT.push(_href);
};

const handleData = (_chunk) => {
	//
	inputSize += _chunk.length;
	
	//
	var byte; for(var i = 0; i < _chunk.length; ++i)
	{
		if(COMMENT)
		{
			if(_chunk.at(i, COMMENTS[1], true))
			{
				COMMENT = false;
			}
		}
		else if(HREF !== null)
		{
			if(_chunk[i] === '>')
			{
				pushURL(HREF);
				HREF = null;
			}
			else if(SEP === null)
			{
				if((byte = _chunk.charCodeAt(i)) <= 32 || byte === 127)
				{
					pushURL(HREF);
					HREF = null;
				}
				else
				{
					HREF += _chunk[i];
				}
			}
			else if(_chunk[i] === SEP)
			{
				pushURL(HREF);
				HREF = null;
			}
			else
			{
				HREF += _chunk[i];
			}
		}
		else if(DEFAULT_IGNORE_COMMENTS && _chunk.at(i, COMMENTS[0], true))
		{
			i += (COMMENTS[0].length - 1);
			COMMENT = true;
		}
		else if(_chunk.at(i, NEEDLE, false))
		{
			i += (NEEDLE.length - 1);

			if(DEFAULT_SEPARATORS.includes(SEP = _chunk[i + 1]))
			{
				++i;
			}
			else
			{
				SEP = null;
			}

			HREF = '';
		}
	}
};

const finish = (_data) => {
	const fin = () => {
		console.debug('               Input: ' + INPUT);
		console.debug('              Output: ' + OUTPUT);
		console.info('     Input file size: ' +
			inputSize.toLocaleString() + ' Bytes');
		console.info('     Extracted Links: ' + (RESULT.length === 0 ?
			'NONE' : RESULT.length.toLocaleString()));
		console.info('Output lines written: ' + (outputSize === 0 ?
			'NONE' : outputSize.toLocaleString() + ' Bytes'));
		console.warn('               Empty: ' + (empty ?
			empty.toLocaleString() : 'NONE'));
		console.warn('              Errors: ' + (errors ?
			errors.toLocaleString() : 'NONE'));
		if(DEFAULT_UNIQUE_HOST) console.debug(
			'      Multiple Hosts: ' + (multiple ?
			multiple.toLocaleString() : 'NONE'));

		if(RESULT.length === 0)
		{
			console.warn(os.EOL + 'WARNING: No links found/extracted, ' +
				'so no output data/file written!');
			process.exit(127);
		}
		
		process.exit(0);
	};
	
	if(RESULT.length === 0)
	{
		return fin();
	}
	
	stream = fs.createWriteStream(OUTPUT, {
		encoding: 'utf8',
		autoClose: true, emitClose: true,
		highWaterMark: DEFAULT_BUFFER });
	stream.once('finish', fin);
	
	var line; for(var i = 0; i < RESULT.length; ++i)
	{
		stream.write(line = (RESULT[i] + os.EOL));
		outputSize += line.length;
	}
	
	const DIFF = (Date.now() - TIME);
	console.debug('        Process Time: ' +
		DIFF.toLocaleString() + ' milliseconds');

	stream.end();
};

//
