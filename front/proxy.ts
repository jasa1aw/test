import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/auth']
const PROTECTED_PATHS = ['/task-list']

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const token = request.cookies.get('token')?.value

	const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
	const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

	if (isProtected && !token) {
		return NextResponse.redirect(new URL('/auth', request.url))
	}

	if (isPublic && token) {
		return NextResponse.redirect(new URL('/task-list', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/task-list/:path*', '/auth'],
}
