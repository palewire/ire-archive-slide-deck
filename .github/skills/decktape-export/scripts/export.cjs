#!/usr/bin/env node

const { execSync } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const defaults = {
	url: 'https://palewi.re/docs/ire-archive-slide-deck/',
	pdf: 'static/screenshots/decktape/ire-archive-deck.pdf',
	images: 'static/screenshots/decktape/slides',
	width: '1440',
	height: '900',
	density: '220',
	quality: '95'
};

const config = parseArgs(process.argv.slice(2));
const pdfPath = resolve(config.pdf);
const imagesDir = resolve(config.images);
const imagesPattern = resolve(imagesDir, 'slide-%02d.png');

mkdirSync(dirname(pdfPath), { recursive: true });
mkdirSync(imagesDir, { recursive: true });

try {
	runCommand(
		`npx decktape --size ${config.width}x${config.height} ${config.url} "${pdfPath}"`,
		'Exporting slides to PDF with decktape'
	);

	const convertBinary = findConvertBinary();
	if (!convertBinary) {
		throw new Error('ImageMagick is required (install with "brew install imagemagick").');
	}

	runCommand(
		`${convertBinary} -density ${config.density} -quality ${config.quality} "${pdfPath}" -scene 1 "${imagesPattern}"`,
		'Converting PDF to slide images with ImageMagick'
	);
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

function parseArgs(argv) {
	const parsed = { ...defaults };

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (!arg.startsWith('--')) continue;

		const key = arg.slice(2);
		const value = argv[index + 1];
		if (!value || value.startsWith('--')) continue;

		switch (key) {
			case 'url':
				parsed.url = value;
				break;
			case 'pdf':
				parsed.pdf = value;
				break;
			case 'images':
				parsed.images = value;
				break;
			case 'width':
				parsed.width = value;
				break;
			case 'height':
				parsed.height = value;
				break;
			case 'density':
				parsed.density = value;
				break;
			case 'quality':
				parsed.quality = value;
				break;
			default:
				break;
		}
	}

	return parsed;
}

function findConvertBinary() {
	for (const binary of ['magick', 'convert']) {
		try {
			execSync(`${binary} -version`, { stdio: 'ignore' });
			return binary;
		} catch (error) {
			continue;
		}
	}

	return null;
}

function runCommand(command, label) {
	console.log(`\n${label}\n> ${command}\n`);
	execSync(command, { stdio: 'inherit' });
}
