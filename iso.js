function drawTile(tileClass, size, position, layer, inner) {
	var width = size.width;
	var height = size.height;

	var x = (position.x - layer);
	var y = (position.y - layer);

	var rot = 0;

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);

	var zindex = 0;
	zindex = (layer * 2) + x + y;

	if (tileClass == 'tile tile_empty') return '';

	if (!inner) inner = '';

	return '<div title="'+tileClass+' x:'+position.x+' y:'+position.y+' z:'+layer+';" class="'+tileClass+'" style="top: '+displayY+'px; left: '+displayX+'px; z-index: '+zindex+';">'+inner+'</div>';
}
function drawLayer(mapSize, tileSize, tileClass, tiles) {
	var l = '<div style="position: absolute; left: 50%; top: '+(tileSize.height * (mapSize.z / 8))+'px">';
	for (var y = 0; y < mapSize.y; y++) {
		for (var x = 0; x < mapSize.x; x++) {
			for (var z = 0; z < mapSize.z; z++) {
				var tile = tiles[z][y][x];
				l += drawTile('tile '+tile, tileSize, size(x, y), z);
			}
		}
	}
	l += '</div>';
	return l;
}
function placeBuilding(map, start, size, tiles) {
	var sz = start.z;
	var sx = start.x;
	var sy = start.y;

	var mxz = size.z + sz;
	var mxx = size.x + sx;
	var mxy = size.y + sy;

	var lastz = (mxz - 1);
	var lastx = (mxx - 1);
	var lasty = (mxy - 1);
	for (var zz = sz; zz < mxz; zz++) {
		for (var xx = sx; xx < mxx; xx++) {
			for (var yy = sy; yy < mxy; yy++) {
				//Check if tile is invisible
				if (zz != lastz) {
					if (xx < lastx && yy < lasty) {
						continue;
					}
				}

				var variation = 'middle_';
				if (zz == sz) variation = 'bottom_';
				if (zz == lastz) variation = 'top_';

				if (yy == sy) variation += 'left_';
				if (yy > sy && yy < lasty) variation += 'middle_';
				if (yy == lasty) variation += 'right_';

				if (xx == sx) variation += 'left';
				if (xx > sx && xx < lastx) variation += 'middle';
				if (xx == lastx) variation += 'right';

				var isMiddleTop = ((xx > sx && xx < lastx) && (yy > sy && yy < lasty)) ? true : false;
				var isMiddle = ((xx > sx && xx < lastx) || (yy > sy && yy < lasty)) ? true : false;

				if (zz == lastz && isMiddleTop && rand(1,5) == 1) variation = 'deco_'+rand(1,8);
				if (zz > sz && zz < lastz && isMiddle && rand(1,5) == 1) variation = 'deco_'+rand(1,4);
				if (zz == sz && isMiddle && rand(1,5) == 1) variation = 'deco_'+rand(5,7);
				if (zz == sz && xx == (sx + 2) && yy == lasty) {
					variation = 'deco_8';
				}

				map[zz][yy][xx] = tiles + ' ' + variation;
			}
		}
	}
}
function size(x, y, z) {
	return {'x': x, 'y': y, 'z': z, 'width': x, 'height': y, 'layers': z};
}