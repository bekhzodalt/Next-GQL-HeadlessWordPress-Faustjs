// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const clubUser = req.cookies.get('club_user')
    const token = req.cookies.get('legacyToken') ? JSON.parse(req.cookies.get('legacyToken')) : false
    if (clubUser && token) {
        const response = NextResponse.redirect(new URL(`/account/legacy?redirect_uri=${path}&token=${token}`, req.url))
        response.cookies.set('legacyToken', '', {
            domain: '.unionleague.org',
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: -1
        })
        return response
    }
    if (path === '/account/legacy') {
        if (!clubUser) return NextResponse.redirect(new URL('/', req.url))
    }
}
