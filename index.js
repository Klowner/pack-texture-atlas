var Spritesmith = require('spritesmith'),
	SpritesmithTexturePacker = require('spritesmith-texturepacker');
	fs = require('fs');

var args = process.argv.slice(2);
if (args.length == 0) {
	console.log('please specify a destination filename!')
	return;
}

var destination_filename_base = args[0];

// Reads all images from the current working directory ('./')
fs.readdir('./', function (err, files) {
	var sprites = files.filter(function (file) { return /\.png$/.test(file); });

	Spritesmith.run({src: sprites}, function (err, result) {
		// Convert the coordinates output to match Spritesmith TexturePacker's
		// expected layout.
		var items = Object.keys(result.coordinates).map(function (key, index) {
			return Object.assign(
				{name: key},
				result.coordinates[key],
				{total_width: result.properties.width, total_height: result.properties.height}
			);
		});

		// Write out the packed image
		var png_path = `${destination_filename_base}.png`;
		var json_path = `${destination_filename_base}.json`;

		fs.open(png_path, 'w', function (err, fd) {
			fs.write(fd, result.image, function (err) {
				fs.close(fd);
				console.log(`wrote ${png_path}`);
			});
		});

		// Write out the metadata for the packed sprites
		fs.open(json_path, 'w', function (err, fd) {
			fs.write(fd, SpritesmithTexturePacker({items: items}), function (err) {
				fs.close(fd);
				console.log(`wrote ${json_path}`);
			});
		});
	});
});

