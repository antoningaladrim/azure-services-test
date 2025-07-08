export const config = {
	apiKey: process.env.AZURE_VISION_API_KEY,

	vision: {
		endpoint: process.env.AZURE_VISION_ENDPOINT,
	},

	database: {
		user: process.env.AZURE_DATABASE_USER ?? '',
		password: process.env.AZURE_DATABASE_PASSWORD ?? '',
		server: process.env.AZURE_DATABASE_SERVER ?? '',
		database: process.env.AZURE_DATABASE_NAME ?? '',
	},

	openai: {
		endpoint: process.env.AZURE_OPENAI_ENDPOINT ?? '',
		deployment: process.env.AZURE_OPENAI_DEPLOYMENT ?? '',
	},

	blob: {
		accountName: process.env.AZURE_BLOB_ACCOUNT_NAME ?? '',
		accountKey: process.env.AZURE_BLOB_ACCOUNT_KEY ?? '',
		containerName: process.env.AZURE_BLOB_CONTAINER_NAME ?? '',
	},
};
