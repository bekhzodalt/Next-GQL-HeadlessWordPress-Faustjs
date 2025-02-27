import { MessagesSendTemplateRequest } from '@mailchimp/mailchimp_transactional'

export async function sendTemplateEmail(envelope: MessagesSendTemplateRequest) {
	const body = JSON.stringify({ envelope })
	const req = await fetch('/api/messaging/mailchimp/sendTemplateEmail', {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body,
	})
	return await req.text()
}
