#!/usr/bin/env node

//
// Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
// https://kekse.biz/ https://github.com/kekse1/javascript/
// v0.0.1
//
// *REALLY* tiny script.. I needed it because "there's no
// `/dev/byte`" or so, to be used via the `dd` utility...
//
// It's a tiny bit `awk`ward.. but hey, I really needed it. x)~
//
// So, argue with your wished target length and as many
// parameters you wish: either strings or integers, which
// we'll use here with `String.fromCodePoint()`. Many
// parameters are concatenated.
//

var length = process.argv[2];

if(isNaN(length))
{
	console.error('Invalid first parameter (target length)');
	process.exit(1);
}

if((length = Number(length)) < 1)
{
	console.error('Invalid first parameter (needs to be greater than zero)');
	process.exit(2);
}

var fill = '';

for(var i = 3; i < process.argv.length; ++i)
{
	if(isNaN(process.argv[i]))
	{
		fill += process.argv[i];
	}
	else
	{
		fill += String.fromCodePoint(Number(process.argv[i]));
	}
}

if(!fill)
{
	console.error('Missing parameter(s) (fill pad string(s) or integer(s))');
	process.exit(3);
}

for(var i = 0; i < length; ++i)
{
	process.stdout.write(fill[i % fill.length]);
}
