"use client";

import { useTranslations } from "next-intl";

export default function Text() {
	const t = useTranslations("Blog");

	return <p className="text-4xl">{t("Recent Posts")}</p>;
}
