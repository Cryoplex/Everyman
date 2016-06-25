function drawTile(tileClass, size, position, layer) {
	var width = size.width;
	var height = size.height;

	var x = (position.x - layer);
	var y = (position.y - layer);

	var rot = 0;

	if (tileClass == 'tile tile_someguy') rot = rand(0, 360);

	var displayX = (x - y) * ((width - 2) / 2);
	var displayY = (x + y) * ((height - 4) / 8);

	return '<div class="'+tileClass+'" style="top: '+displayY+'px; left: '+displayX+'px; -webkit-filter: hue-rotate('+rot+'deg)"></div>';
}
function drawLayer(mapSize, tileSize, tileClass, tiles, replacement) {
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
function size(x, y, z) {
	return {'x': x, 'y': y, 'z': z, 'width': x, 'height': y, 'layers': z};
}