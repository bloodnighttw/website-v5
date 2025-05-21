import type { Metadata } from "next";
import "../global.css";
import Avatar from "@/components/modules/avatar";
import React from "react";
import Link from "@/i18n/navigation";
import NavBar from "@/components/modules/panel/nav";
import Footer from "@/components/modules/panel/footer";
import PanelButton from "@/components/modules/panel/nav/anchor";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ChangeLanguage from "@/components/modules/panel/nav/change-language";
import Providers from "@/app/[locale]/providers";

// generates metadata for each locale
export async function generateMetadata() {
	const t = await getTranslations("Meta");
	return {
		title: t("title"),
		description: t("description")
	} as Metadata;
}


export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(
	{ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }>}>
) {

	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);
	const t = await getTranslations("Panel");

	return (
		<html lang={locale}>
		<head>
			<meta
				httpEquiv="Delegate-CH"
				content="sec-ch-dpr https://bntw.dev; sec-ch-viewport-width https://bntw.dev"
			/>
		</head>
		<body className={`$antialiased`}>
			<NextIntlClientProvider>
				<Providers>
				<NavBar>
					<Link href="/">
						<Avatar
							src="https://avatars.githubusercontent.com/u/44264182"
							size={32}
							className="h-8 w-8 my-auto"
						/>
					</Link>

					<Link href="/">
						<div className="font-bold fade-in">{t("name")}</div>
					</Link>
					<div className="mr-auto"></div>
					<PanelButton href={"/friends"} text={t("friends")}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							 className="bi bi-people" viewBox="0 0 16 16">
							<path
								d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
						</svg>
					</PanelButton>

					<PanelButton href={"/blog"} text={t("Blog")}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
							 className="bi bi-vector-pen" viewBox="0 0 16 16">
							<path fillRule="evenodd"
								  d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z" />
							<path fillRule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z" />
						</svg>
					</PanelButton>

					<ChangeLanguage />

				</NavBar>

				{children}

				<Footer>
					<div className="w-full flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
						<span className="mr-auto">
							© {new Date().getFullYear()} bloodnighttw {t("all rights reserved")}
						</span>

						<span>{t("madeWith")}</span>
					</div>
				</Footer>
				</Providers>
			</NextIntlClientProvider>
		</body>
		</html>
	);
}
