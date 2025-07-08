import {
	BlobSASPermissions,
	BlobServiceClient,
	SASProtocol,
	StorageSharedKeyCredential,
	generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { config } from '../config';

const accountName = config.blob.accountName;
const accountKey = config.blob.accountKey;
const containerName = config.blob.containerName;
const endpointUrl = `https://${accountName}.blob.core.windows.net`;

const createSasUrl = ({
	accountName,
	accountKey,
	containerName,
	blobName,
	permissions = 'cw',
	expiresInSeconds = 300,
}: {
	accountName: string;
	accountKey: string;
	containerName: string;
	blobName: string;
	permissions?: string;
	expiresInSeconds?: number;
}) => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		accountName,
		accountKey
	);
	const now = new Date();
	const expiresOn = new Date(now.getTime() + expiresInSeconds * 1000);
	const sas = generateBlobSASQueryParameters(
		{
			containerName,
			blobName,
			permissions: BlobSASPermissions.parse(permissions),
			startsOn: now,
			expiresOn,
			protocol: SASProtocol.Https,
		},
		sharedKeyCredential
	).toString();
	return `${endpointUrl}/${containerName}/${blobName}?${sas}`;
};

const uploadBlob = async ({
	accountName,
	accountKey,
	containerName,
	blobName,
	content,
}: {
	accountName: string;
	accountKey: string;
	containerName: string;
	blobName: string;
	content: string | Blob;
}) => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		accountName,
		accountKey
	);
	const blobServiceClient = new BlobServiceClient(
		endpointUrl,
		sharedKeyCredential
	);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);
	await blockBlobClient.uploadData(
		typeof content === 'string' ? new Blob([content]) : content
	);
};

const downloadBlob = async ({
	accountName,
	accountKey,
	containerName,
	blobName,
}: {
	accountName: string;
	accountKey: string;
	containerName: string;
	blobName: string;
}) => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		accountName,
		accountKey
	);
	const blobServiceClient = new BlobServiceClient(
		endpointUrl,
		sharedKeyCredential
	);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);
	const downloadResponse = await blockBlobClient.download();

	if (!downloadResponse.blobBody) {
		console.error('No blob body');
		return '';
	}

	const downloaded = await blobToString(await downloadResponse.blobBody);
	return downloaded;
};

async function blobToString(blob: Blob): Promise<string> {
	const fileReader = new FileReader();
	return new Promise<string>((resolve, reject) => {
		fileReader.onloadend = (ev: any) => {
			resolve(ev.target!.result);
		};
		fileReader.onerror = reject;
		fileReader.readAsText(blob);
	});
}

const testWithSasUrl = async () => {
	const blobName = 'testWithoutClient.txt';
	const sasUrl = createSasUrl({
		accountName,
		accountKey,
		containerName,
		blobName,
		permissions: 'cw', // create and write
		expiresInSeconds: 300,
	});
	await fetch(sasUrl, {
		method: 'PUT',
		body: new Blob(['this is a new test']),
	});

	const blobContent = await downloadBlob({
		accountName,
		accountKey,
		containerName,
		blobName,
	});
	console.log('Downloaded blob with sas url');
	console.log('Content', blobContent);
};

const testDirectUpload = async () => {
	const blobName = 'testWithClient.txt';
	await uploadBlob({
		accountName,
		accountKey,
		containerName,
		blobName,
		content: 'this is a test',
	});

	const blobContent = await downloadBlob({
		accountName,
		accountKey,
		containerName,
		blobName,
	});
	console.log('Downloaded blob with client');
	console.log('Content', blobContent);
};

testWithSasUrl();
testDirectUpload();
