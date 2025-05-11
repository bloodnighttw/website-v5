import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware({
	// A list of all locales that are supported
	locales: routing.locales,

	// Used when no locale matches
	defaultLocale: routing.defaultLocale,

	// This function is called when a request is made to a page without a locale prefix
	localeDetection: true,

	// This function is called for each request to determine the locale
	localePrefix: 'always'
});

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
