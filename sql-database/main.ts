// @see https://learn.microsoft.com/en-us/javascript/api/overview/azure/sql?view=azure-node-latest

import { Connection, Request } from 'tedious';
import { config } from '../config';

const connection = new Connection(config.database);
connection.on('connect', (err) => {
	err ? console.log(err) : executeStatement();
});

const query = 'SELECT * from TableName';
const executeStatement = () => {
	const request = new Request(query, (err, rowCount) => {
		err ? console.log(err) : console.log(rowCount);
	});

	request.on('row', (columns) => {
		columns.forEach((column) => console.log(column.value));
	});

	connection.execSql(request);
};
