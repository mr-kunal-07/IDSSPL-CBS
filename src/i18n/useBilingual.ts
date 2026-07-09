"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PRIMARY_LANGUAGE } from "./config";
import { useI18nDebug } from "./I18nDebugContext";

/** Simplified translator signature used across the app. */
export type Translate = (key: string, options?: Record<string, unknown>) => string;

/**
 * Helper for the app's bilingual UI.
 *
 *  - `en`  -> always-English (left / primary side of a label).
 *  - `t`   -> the currently selected secondary language (right side),
 *             controlled by the LanguageSwitcher.
 *  - `i18n`-> the i18next instance (e.g. to read the active language).
 *
 * When the dev-only "show key IDs" toggle is on, both `en` and `t` return the
 * key itself (e.g. "accountMaster.title") instead of the translated text, so
 * you can see exactly which string maps to which key.
 *
 * Example:
 *   const { en, t } = useBilingual();
 *   <span>{en("fields.accountCode")}</span> / <span>{t("fields.accountCode")}</span>
 */
export function useBilingual() {
  const { t: tRaw, i18n } = useTranslation();
  const { showKeys } = useI18nDebug();

  const enRaw = useMemo(() => i18n.getFixedT(PRIMARY_LANGUAGE), [i18n]);

  const wrap = (fn: (key: string, options?: Record<string, unknown>) => unknown): Translate =>
    showKeys ? (key) => key : (key, options) => String(fn(key, options));

  const t = useMemo<Translate>(() => wrap(tRaw), [tRaw, showKeys]);
  const en = useMemo<Translate>(() => wrap(enRaw), [enRaw, showKeys]);

  // `secondaryLanguage` exposes the active language so consumers re-render when
  // the secondary language changes.
  return { t, en, i18n, secondaryLanguage: i18n.language };
}
