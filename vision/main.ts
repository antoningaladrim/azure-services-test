// @see https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/ComputerVision/REST/node-print-text.md

import request from 'request';
import { config } from '../config';

const apiKey = config.apiKey;
const endpoint = config.vision.endpoint;

const uriBase = `${endpoint}/vision/v3.1/ocr`;

const imageUrl = 'https://jeroen.github.io/images/testocr.png';

const params = {
	language: 'unk',
	detectOrientation: 'true',
};

const options = {
	uri: uriBase,
	qs: params,
	body: `{"url": "${imageUrl}"}`,
	headers: {
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key': apiKey,
	},
};

request.post(options, (error, response, body) => {
	if (error) {
		console.log('Error: ', error);
		return;
	}
	const jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
	console.log('JSON Response\n');
	console.log(jsonResponse);
});
