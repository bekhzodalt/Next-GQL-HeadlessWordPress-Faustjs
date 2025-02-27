import mailchimp from '@mailchimp/mailchimp_transactional'
import type { MessagesSendTemplateRequest } from '@mailchimp/mailchimp_transactional'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function DancingMonkey(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { action } = req.query

	if (req.method === 'POST') {
		if (!req.body || !req.body.envelope) throw 'Missing required fields'

		const { MC_EMAIL_SENDER, MC_KEY } = process.env
		if (!MC_KEY || !MC_EMAIL_SENDER) throw 'Could not locate required env vars'

		try {
			const mailer = await mailchimp(MC_KEY)
			if (!mailer) throw 'mailer instance does not exist'

			if (action[0] === 'sendTemplateEmail') {
				const envelope: MessagesSendTemplateRequest = req.body.envelope
				if (!envelope.message.from_email)
					envelope.message.from_email = MC_EMAIL_SENDER
				if (!envelope.message.from_name) envelope.message.from_name = 'No Reply'

				envelope.message.headers['sender'] = MC_EMAIL_SENDER

				const response = await mailer.messages.sendTemplate(envelope)

				if (Array.isArray(response)) {
					res.status(200).send(response[0].status)
					return
				} else {
					throw response.response.data['message']
				}
			}
		} catch (error) {
			res.status(400).send(error)
			return
		}
	} else {
		res
			.status(405)
			.send('Request to endpoint denied (only POST request are allowed)')
		return
	}
}
