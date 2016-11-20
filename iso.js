function drawTile(tileClass, size, position, layer, inner, opacity, bpos) {
	var width = size.width;
	var height = size.height;

	var x = (position.x - (layer * 2));
	var y = (position.y - (layer) * 2);

	var rot = 0;

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);

	var zindex = 0;
	zindex = (layer * 4) + position.x + position.y;

	if (tileClass == 'tile tile_empty') return '';

	if (!inner) inner = '';

	return '<div class="'+tileClass+'" style="opacity: '+opacity+'; '+bpos+'; top: '+displayY+'px; left: '+displayX+'px; z-index: '+zindex+';">'+inner+'</div>';
}

function getIsoTilePosition(size, position) {
	var layer = position.z;
	var width = size.width;
	var height = size.height;

	var x = (position.x - layer);
	var y = (position.y - layer);

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);


	return {
		'left': displayX+'px',
		'top': displayY+'px',
	}
}
function drawLayer(mapSize, tileSize, tileClass, tiles) {
	var l = '<div style="position: absolute; left: 50%; top: '+(tileSize.height * (mapSize.z / 8))+'px">';
	for (var y = 0; y < mapSize.y; y++) {
		for (var x = 0; x < mapSize.x; x++) {
			for (var z = 0; z < mapSize.z; z++) {
				if (tiles[z] == undefined) tiles[z] = [];
				if (tiles[z][y] == undefined) tiles[z][y] = [];
				if (tiles[z][y][x] == undefined) continue;
				var tile = tiles[z][y][x];
				var opacity = 1;
				l += drawTile('tile '+tile, tileSize, size(x, y), z, '', opacity);
			}
		}
	}
	l += '</div>';
	return l;
}
function isVisible(map, position, ret) {
	var diags = checkDiagonals(map, position);
	if (diags.length > 0) {
		if (ret) {
			return diags;
		}
		return false;
	}
	return true;
}
function diagonalFrom(position) {
	var pos = {};
	pos.x = position.x + 1;
	pos.y = position.y + 1;
	pos.z = position.z + 1;
	return pos;
}
function checkDiagonals(map, fromPosition) {
	if (!fromPosition) fromPosition = size(0, 0, 0);
	if (!fromPosition.x) fromPosition.x = 0;
	if (!fromPosition.y) fromPosition.y = 0;
	if (!fromPosition.z) fromPosition.z = 0;

	var maxz = map.length;
	var maxy = map[0].length;
	var maxx = map[0][0].length;

	var diagonals = [];

	while (!isOutOfBoundaries(map, diagonalFrom(fromPosition))) {
		var diag = diagonalFrom(fromPosition);
		var bcheck = isOutOfBoundaries(map, diag);
		if (bcheck) continue;
		var tile = map[diag.z][diag.y][diag.x];

		if (tile != 'tile_empty' && tile != 'tile tile_empty') diagonals.push(size(diag.x, diag.y, diag.z));

		fromPosition.x = diag.x;
		fromPosition.y = diag.y;
		fromPosition.z = diag.z;
	}

	return diagonals;
}
function isOutOfBoundaries(map, pos) {
	if (!map) return true;
	if (map[pos.z]) {
		if (map[pos.z][pos.y]) {
			if (map[pos.z][pos.y][pos.x]) {
				return false;
			}
		}
	}
	return true;
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
				if (zz > sz && zz < lastz) {
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
				var decomode = true;
				if (tiles == 'tile_agro') decomode = false;

				if (zz == lastz && isMiddleTop && rand(1,5) == 1 && decomode) variation = 'deco_'+rand(1,8);
				if (zz > sz && zz < lastz && isMiddle && rand(1,5) == 1) variation = 'deco_'+rand(1,4);
				if (zz == sz && isMiddle && rand(1,5) == 1) variation = 'deco_'+rand(5,7);
				if (zz == sz && xx == (sx + 1) && yy == lasty) {
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