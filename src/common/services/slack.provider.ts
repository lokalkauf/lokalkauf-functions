import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook';




export async function sendMessage(app: admin.app.App, message: string, imageURL?: string) {

    const slackHook = (functions.config().slack)? functions.config().slack.insightshook : (app.options as any)?.slack?.insightshook;

    const webhook = new IncomingWebhook(`https://hooks.slack.com/services/${slackHook}`);
    const slackMsg: IncomingWebhookSendArguments = {
        blocks: []   
    };

    if (imageURL) {
        (slackMsg.blocks as any).push({
            type: "image",
            title: {
                type: "plain_text",
                text: message,
                emoji: true
            },
            image_url: imageURL,
            alt_text: "image1"
        });
        // (slackMsg?.blocks as any)[0].image_url = imageURL;
    } else {
        (slackMsg.blocks as any).push(		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: message
			}
		});
    }

    await webhook.send(slackMsg);
}