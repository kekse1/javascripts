/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/javascripts/
 * v0.1.0
 *
 */

function transposition(_array, _width, _height)
{
	const getCoord = (_pos) => {
			const z = Math.floor(_pos / (_height * _width));
			const a = (_pos % (_height * _width));
			const y = Math.floor(a / _width);
			const x = (a % _width);
			return [ x, y, z ]; };
	const getPos = (_x, _y, _z) => (_y +
			(_x * _height) +
			(_z * _height * _width));

	const result = (Array.isArray(_array) ?
		new Array(_array.length) :
		new Uint8Array(_array.length));

	for(var i = 0; i < _array.length; ++i)
	{
		result[getPos(... getCoord(i))] = _array[i];
	}

	return result;
}

