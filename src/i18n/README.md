# Internationalization (i18n) Guide

This app is **bilingual**. Every user-facing label shows **English on the left**
and a **selectable second language on the right** (Marathi by default, Hindi
optional). This guide explains how it works and how to add or change strings.

Built on [`react-i18next`](https://react.i18next.com/). You don't need to be an
i18n expert — 90% of the time you'll just call two helper functions.

---

## TL;DR — the two functions you'll use

```tsx
"use client";
import { useBilingual } from "@/i18n/useBilingual";

export default function MyComponent() {
  const { en, t } = useBilingual();

  return (
    <h1>
      {en("accountMaster.title")}                     {/* left  = always English */}
      <span> / {t("accountMaster.title")}</span>      {/* right = selected language */}
    </h1>
  );
}
```

- **`en(key)`** → the English text (the fixed, left-hand side).
- **`t(key)`** → the text in the language the user picked (the right-hand side).

Both take the same key. That's the whole idea: one key, two renderings.

> The component **must** be a Client Component (`"use client"` at the top),
> because the hooks run in the browser.

---

## The mental model

| Side  | Helper  | Language                                  |
| ----- | ------- | ----------------------------------------- |
| Left  | `en()`  | Always English (never changes)            |
| Right | `t()`   | The language chosen in the header dropdown |

- Elements that were **English-only** in the design (breadcrumbs, buttons,
  filter labels) use **only `en()`** — no right-hand side.
- Elements that show a **pair** (titles, field labels) use **both** `en()` and
  `t()` with the same key.

The default right-hand language is **Marathi** (`mr`), matching the original
app. See `DEFAULT_SECONDARY_LANGUAGE` in `config.ts`.

---

## File structure

```
src/i18n/
├── config.ts               # i18next init, language list, resources
├── I18nProvider.tsx        # wraps the app (mounted in ClientLayout)
├── useBilingual.ts         # the useBilingual() hook  ← you use this
├── I18nDebugContext.tsx    # dev-only "show key IDs" state
├── I18nKeyToggle.tsx       # dev-only floating 🔑 button
├── README.md               # this file
└── locales/
    ├── en.json             # English  (source of truth)
    ├── hi.json             # Hindi
    └── mr.json             # Marathi
scripts/
└── extract_i18n.py         # scans pages + regenerates the locale JSON
src/components/
└── LanguageSwitcher.tsx    # the header dropdown
```

---

## Keys and the locale files

Keys are **namespaced with dots** and stored as **nested JSON**. Example:

`en.json`
```json
{
  "common":  { "cancel": "Cancel", "save": "Save" },
  "accountMaster": { "title": "Account Master" }
}
```

- `t("common.cancel")` → `"Cancel"` (en) / `"रद्द करा"` (mr) / `"रद्द करें"` (hi)
- `t("accountMaster.title")` → looks up `accountMaster.title` in the active locale.

**Every key must exist in all three files (`en`, `hi`, `mr`) with the same
shape.** If a key is missing in the active language, i18next falls back to
English.

### Naming conventions

- Namespace by feature/page: `accountMaster.*`, `branchMaster.*`, `tdCalculate.*`.
- Truly shared strings go in `common.*` (Cancel, Save, Home, …) or `fields.*`
  (Account Code, Remark, …).
- Use `camelCase` for the leaf: `common.misActivity`, `fields.accountCode`.

---

## How to add a new string

### Option A — quick, by hand (recommended for one-offs)

1. Add the key to **all three** locale files with the same nesting:

   `en.json`
   ```json
   "customerMaster": { "exportLabel": "Export to Excel" }
   ```
   `hi.json`
   ```json
   "customerMaster": { "exportLabel": "एक्सेल में निर्यात करें" }
   ```
   `mr.json`
   ```json
   "customerMaster": { "exportLabel": "एक्सेलमध्ये निर्यात करा" }
   ```

2. Use it:
   ```tsx
   <button>{en("customerMaster.exportLabel")}</button>
   ```

That's it — no rebuild step, hot reload picks it up.

### Option B — via the extraction script (keeps translations in one place)

`scripts/extract_i18n.py` holds a `CATALOG` dict that is the single source for
every key + its `en`/`hi`/`mr` values, and it **regenerates** the three JSON
files. Use this when adding several keys at once.

1. Open `scripts/extract_i18n.py`, add an entry to `CATALOG`:
   ```python
   "customerMaster.exportLabel": {
       "en": "Export to Excel",
       "hi": "एक्सेल में निर्यात करें",
       "mr": "एक्सेलमध्ये निर्यात करा",
   },
   ```
2. Regenerate the locale files:
   ```bash
   python3 scripts/extract_i18n.py
   ```
   This rewrites `src/i18n/locales/{en,hi,mr}.json` and prints a coverage report
   (`i18n-extraction-report.json`, git-ignored).

> Pick **one** approach per key. If a key lives in the `CATALOG`, edit it there,
> because re-running the script will overwrite hand edits to the JSON.

---

## Interpolation (variables in strings)

Use `{{name}}` placeholders in the JSON and pass values as the second argument:

`en.json`
```json
"memo": { "charactersOnly": "{{count}} Characters Only" }
```
```tsx
en("memo.charactersOnly", { count: maxChars })   // "200 Characters Only"
```

---

## Common patterns (copy/paste)

**Bilingual page title (nav component):**
```tsx
<NavbarAM
  titleEn={en("accountMaster.title")}   // left, English
  titleHi={t("accountMaster.title")}    // right, selected language
  breadcrumbs={[
    { label: en("common.home"), href: "/" },        // breadcrumbs stay English
    { label: en("common.misActivity"), href: "/" },
    { label: en("accountMaster.breadcrumb"), href: "/" },
  ]}
/>
```

**Bilingual field label:**
```tsx
<label>
  {en("fields.accountCode")} / <span>{t("fields.accountCode")}</span>
</label>
```

**English-only button:**
```tsx
<button>{en("common.cancel")}</button>
```

---

## The language switcher

`LanguageSwitcher.tsx` lives in the header (top-right). It changes the
**right-hand** language and saves the choice to `localStorage`
(`idsspl.lang`). The left side always stays English.

---

## Dev tool: see the key behind any string 🔑

In **development only**, a small **🔑 button** sits in the bottom-right corner.
Hover to expand, click to toggle. When on, every string rendered through
`useBilingual` is replaced by its **key ID** (e.g. `accountMaster.title`), so
you can see exactly which key maps where. Click again to turn it off. The choice
persists across reloads and is completely stripped from production builds.

If a label does **not** switch to a key ID when the toggle is on, it means that
text isn't going through `useBilingual` yet — wrap it with `en()` / `t()`.

---

## Adding a whole new language (e.g. Gujarati `gu`)

1. Create `src/i18n/locales/gu.json` (copy `en.json`, translate the values).
2. In `config.ts`:
   ```ts
   import gu from "./locales/gu.json";

   export const LANGUAGES = [
     { code: "mr", label: "मराठी" },
     { code: "hi", label: "हिंदी" },
     { code: "gu", label: "ગુજરાતી" },   // add here
     { code: "en", label: "English" },
   ] as const;

   export const resources = {
     en: { translation: en },
     hi: { translation: hi },
     mr: { translation: mr },
     gu: { translation: gu },             // and here
   } as const;
   ```
3. (Optional) add `"gu"` support to `scripts/extract_i18n.py` if you use it.

The switcher and everything else pick it up automatically.

---

## Rules of thumb

- ✅ Every new key goes into **all three** locale files.
- ✅ Component using `en()`/`t()` must be `"use client"`.
- ✅ Left side = `en()`, right side = `t()`, same key.
- ✅ Reuse `common.*` / `fields.*` before inventing a new namespace.
- ❌ Don't hardcode display strings in JSX — route them through a key.
- ❌ Don't hand-edit the JSON for keys that live in the script's `CATALOG`.

## Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| Label shows the raw key (e.g. `accountMaster.title`) unexpectedly | Key missing in the active locale, or the dev 🔑 toggle is on. |
| Right side doesn't change with the dropdown | Text is using `en()` (English-only) instead of `t()`. |
| `Cannot find module './locales/xx.json'` | New locale file not created or not imported in `config.ts`. |
| Hook error / blank render | Component isn't `"use client"`, or is rendered outside `I18nProvider`. |
