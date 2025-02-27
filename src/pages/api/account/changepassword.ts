import date from '@archipress/utilities/date'
import { NextApiRequest, NextApiResponse } from 'next'
import * as crypto from 'crypto'

export interface PasswordChangePayload {
	username: string
	password: string
	new_password: string
}

export default async function ChangePassword(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		try {
			const { body }: { body: any } = req

			if (!body?.username || !body?.password || !body?.new_password)
				throw new Error('Missing required fields in payload')

			const key = process.env.FAUSTWP_SECRET_KEY

			if (!key) throw new Error('FAUSTWP_SECRET_KEY env var not set')

			const timestamp = date().unix()

			const token = Buffer.from(
				crypto
					.createHmac('sha256', key)
					.update(
						`${body?.username}|${body?.password}|${body?.new_password}|${timestamp}`
					)
					.digest('hex')
			).toString('base64url')

			if (process.env.DEPLOYMENT === 'staging') {
				body.staging = true
			}

			const payload = JSON.stringify({
				...body,
				timestamp,
				token,
			})

			const changePasswordReq = await fetch(
				'https://www.unionleague.org/members/inc/change-password.php',
				{
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: payload,
				}
			)

			res
				.status(changePasswordReq.status)
				.send(changePasswordReq.status === 200 ? 'success' : 'failed')
		} catch (error) {
			res.status(400).send(error)
		}
	} else {
		res
			.status(405)
			.send('Request to endpoint is denied (Only POST request are allowed)')
		return
	}
}
