function drawTileIso(tileClass, size, position, layer, inner, opacity, bpos, addclass, mapx, mapy, isStatic) {
	if (mapx == undefined) mapx = player.mapID.x;
	if (mapy == undefined) mapy = player.mapID.y;
	var width = size.width;
	var height = size.height;

	var elayer = layer;
	if (tileClass.match('buildg')) elayer = elayer + 8.5;

	var x = (position.x - (elayer * 2));
	var y = (position.y - (elayer) * 2);

	var rot = 0;

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);

	var zindex = 0;
	zindex = (layer * 4) + position.x + position.y;

	if (tileClass == 'tile tile_empty') return '';

	if (!inner) inner = '';

	var absx = (mapx * MAP_WIDTH) + position.x;
	var absy = (mapy * MAP_HEIGHT) + position.y;

	return '<tile class="ts_'+addclass+'"><div id="intile_'+mapx+'_'+mapy+'_'+position.x+'_'+position.y+'_'+layer+'" class="'+tileClass+'" style="opacity: '+opacity+'; '+bpos+'; top: '+displayY+'px; left: '+displayX+'px; z-index: '+zindex+';">'+inner+'</div></tile>';
}
function drawTile(tileClass, size, position, layer, inner, opacity, bpos, addclass, mapx, mapy, isStatic) {
	if (mapx == undefined) mapx = player.mapID.x;
	if (mapy == undefined) mapy = player.mapID.y;
	var width = size.width;
	var height = size.height;

	var elayer = layer;

	var x = (position.x);
	var y = (position.y);

	var rot = 0;

	var displayX = x * width;
	var displayY = (y * (height/2)) - (elayer * (height/2));

	var zindex = 0;
	zindex = elayer * 4;

	if (tileClass == 'tile tile_empty') return '';

	if (!inner) inner = '';

	return '<tile class="ts_'+addclass+'"><div id="intile_'+mapx+'_'+mapy+'_'+position.x+'_'+position.y+'_'+layer+'" class="'+tileClass+'" style="opacity: '+opacity+'; '+bpos+'; top: '+displayY+'px; left: '+displayX+'px; z-index: '+zindex+';">'+inner+'</div></tile>';
}

function getIsoTilePosition(size, position, ret2) {
	var layer = position.z;
	var width = size.width;
	var height = size.height;

	var x = (position.x - layer);
	var y = (position.y - layer);

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);

	displayX += 20;

	if (!ret2) {
		displayX = displayX+'px';
		displayY = displayY+'px';
	}


	return {
		'left': displayX,
		'top': displayY,
	}
}
function drawSurroundings(mapSize, tileSize, tiles, addclass) {
	var ds = '';
	for (var cx in city.map) {
		for (var cy in city.map[cx]) {
			var dx = Math.abs(player.mapID.x - parseInt(cx));
			var dy = Math.abs(player.mapID.y - parseInt(cy));
			if (dx > 1 || dy > 1) continue;
			ds += drawLayer(mapSize, tileSize, city.map[cx][cy], addclass, cx, cy)
		}
	}
	return ds;
}
function drawLayer(mapSize, tileSize, tiles, addclass, mapx, mapy, isStatic) {
	var l = '<div style="position: absolute; left: 0px; top: 0px">';

	for (var z = 0; z < mapSize.z; z++) {
		if (tiles[z] == undefined || tiles[z].length <= 0) {
			tiles[z] == undefined;
			continue;
		}
		for (var y = 0; y < mapSize.y; y++) {
			if (tiles[z][y] == undefined || tiles[z][y].length <= 0) {
				tiles[z][y] == undefined;
				continue;
			}
			for (var x = 0; x < mapSize.x; x++) {
				if (tiles[z][y][x] == undefined || tiles[z][y][x] == 'tile_empty') {
				tiles[z][y][x] == undefined;
				continue;
				}
				if (tiles[z] == undefined) tiles[z] = [];
				if (tiles[z][y] == undefined) tiles[z][y] = [];
				if (tiles[z][y][x] == undefined) continue;
				var tile = tiles[z][y][x];
				var opacity = 1;

				l += drawTile(tile+' tile', tileSize, size(x, y), z, '', opacity, undefined, addclass, mapx, mapy, isStatic);
			}
		}
	}

	l += '</div>';
	return l;
}
function drawLayerIso(mapSize, tileSize, tiles, addclass, mapx, mapy, isStatic) {
	var l = '<div style="position: absolute; left: 80%; top: '+(tileSize.height * (mapSize.z / 8))+'px">';

	for (var z = 0; z < mapSize.z; z++) {
		if (tiles[z] == undefined || tiles[z].length <= 0) {
			tiles[z] == undefined;
			continue;
		}
		for (var y = 0; y < mapSize.y; y++) {
			if (tiles[z][y] == undefined || tiles[z][y].length <= 0) {
				tiles[z][y] == undefined;
				continue;
			}
			for (var x = 0; x < mapSize.x; x++) {
				if (tiles[z][y][x] == undefined || tiles[z][y][x] == 'tile_empty') {
				tiles[z][y][x] == undefined;
				continue;
				}
				if (tiles[z] == undefined) tiles[z] = [];
				if (tiles[z][y] == undefined) tiles[z][y] = [];
				if (tiles[z][y][x] == undefined) continue;
				var tile = tiles[z][y][x];
				var opacity = 1;

				l += drawTile(tile+' tile', tileSize, size(x, y), z, '', opacity, undefined, addclass, mapx, mapy, isStatic);
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

	var mxz = (size.z * 2) + sz;
	var mxx = size.x + sx;
	var mxy = size.y + sy;

	var lastz = (mxz - 1);
	var lastx = (mxx - 1);
	var lasty = (mxy - 1);

	var yy = mxy;

	for (var xx = sx; xx < mxx; xx++) {
		for (var zz = sz; zz < mxz; zz+=2) {
			var vari = rand(3,4);
			if (xx == sx) vari = 1;
			if (xx == (sx + 1)) vari = 2;
			if (xx == (mxx - 1)) vari = 5;

			var place = 'mid';
			if (zz == sz) place = 'bot';
			if (zz == (mxz - 2)) place = 'top';

			map[zz][yy][xx] = tiles+' '+'b_'+place+'_'+vari;
		}
	}
	return;
	for (var zz = sz; zz < MAX_LAYERS; zz++) {
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