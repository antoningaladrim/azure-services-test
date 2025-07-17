const run = async () => {
	const response = await fetch('https://jeroen.github.io/images/testocr.png');
	const fileArrayBuffer = await response.arrayBuffer();
	console.log(Buffer.from(fileArrayBuffer).toString('base64'));
};

run();
