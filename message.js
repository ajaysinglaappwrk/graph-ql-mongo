// const { QueueClient } = require("@azure/storage-queue");
// const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=opsoestorage;AccountKey=L/2SY0v00Vs/FvoY7yM9GFO8wm+Xd/JKOnWqT6jA7oG0iDiWEtnJCPZ2ObO/MUHaO7sm6LSujY1Bim0lzk+tYw==;EndpointSuffix=core.windows.net'
// const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, 'myQueue');
var azure = require('azure-storage');

const storageAccount = 'opsoestorage';
const storageAccessKey = 'L/2SY0v00Vs/FvoY7yM9GFO8wm+Xd/JKOnWqT6jA7oG0iDiWEtnJCPZ2ObO/MUHaO7sm6LSujY1Bim0lzk+tYw==';
var queueService = azure.createQueueService(storageAccount, storageAccessKey);

//create
const createQueue = (queueName) => {
	queueService.createQueueIfNotExists(queueName, function (error, result) {
		if (error) {
			console.error('Create queue error');
		} else {
			console.error('Create queue successfully');
		}
	});
}

module.exports = (queueName, messageData) => {
	createQueue('myqueue')
	queueService.createMessage(queueName, messageData, function (error, results, response) {
		if (error) {
			console.error('Create message error')
		} else {
			console.error('Create message successfully');
		}
	});
}

// export default (req, res) => {
// 	console.log(req.body);
// 	createMessage('myqueue',JSON.stringify(req.body));
// 	res.statusCode = 200
// 	res.send(req.body);
// }
