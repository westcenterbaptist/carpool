const axios = require('axios');

module.exports = async function (context, req) {
    let msg;
    let fromNum;
    const slackWebhookUrl = process.env.SlackWebhook;

    try {
        const params = new URLSearchParams(req.body.toString('utf-8').trim());
        context.log("PARAMS:", params);
        const parsedData = {};
        
        for (const [key, value] of params) {
            parsedData[key] = value;
        }
        
        fromNum = parsedData['From'];
        msg = parsedData['Body'];

        context.log("FROM:", fromNum);
        context.log("MESSAGE:", msg);

    } catch (error) {
        console.log('Error decoding data:', error);
    }
    
    const message = `\n*Carpool Request*\nFrom: ${fromNum}\nMessage: ${msg}`;

    const slackMessage = {
	    text: message,
	    mrkdwn: true,
    };

    try {
        const response = await axios.post(slackWebhookUrl, slackMessage);
        console.log('Slack message sent:', response.data);
        return {
            statusCode: 200,
            body: JSON.stringify('Slack message sent successfully!'),
        };
    } catch (error) {
        console.error('Error sending Slack message:', error);
        return {
            statusCode: 400,
            body: JSON.stringify('Incorrect Data'),
        };
    }
}