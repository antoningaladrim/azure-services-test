import { AzureOpenAI } from 'openai';
import { config } from '../config';

const apiVersion = '2024-10-21';

const openaiClient = new AzureOpenAI({
	apiKey: config.apiKey,
	apiVersion,
	endpoint: config.openai.endpoint,
	deployment: config.openai.deployment,
});

const testChatCompletion = async () => {
	const response = await openaiClient.chat.completions.create({
		model: 'gpt-4.1',
		messages: [
			{
				role: 'user',
				content: 'Say hello from Azure OpenAI!',
			},
		],
		response_format: { type: 'json_object' },
	});

	const reply = response.choices[0].message.content;
	console.log('Azure OpenAI reply:', reply);
};

testChatCompletion();
