#!/usr/bin/env python3
"""
extract_i18n.py
================
Extracts user-facing strings from the Next.js pages under `src/app/(root)`
and generates locale message files for react-i18next (en / hi / mr).

What it does
------------
1. Scans every `*.tsx` file under src/app/(root).
2. Detects candidate UI strings using regex patterns for the codebase's
   conventions:
      - titleEn="..."  / titleHi="..."
      - label / labelHi props
      - breadcrumb  { label: "..." }
      - inline "English / <span>native</span>" JSX pairs
      - button / heading / placeholder text
   and writes a coverage report to  i18n-extraction-report.json
3. Emits nested locale files:
      src/i18n/locales/en.json
      src/i18n/locales/hi.json
      src/i18n/locales/mr.json
   built from the curated CATALOG below (English is the source of truth;
   hi/mr are human-curated translations, with the original in-code native
   strings preserved for Marathi where they existed).

Run:
    python3 scripts/extract_i18n.py
"""

from __future__ import annotations
import json
import re
from pathlib import Path

# ----------------------------------------------------------------------------
# Paths
# ----------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parents[1]
PAGES_DIR = ROOT / "src" / "app" / "(root)"
LOCALES_DIR = ROOT / "src" / "i18n" / "locales"
REPORT_FILE = ROOT / "i18n-extraction-report.json"

# ----------------------------------------------------------------------------
# Curated translation catalog.
# Keys are namespaced (dot notation -> nested JSON). English is authoritative.
# Marathi (mr) values reuse the native strings already present in the code
# where they existed; Hindi (hi) values are added.
# ----------------------------------------------------------------------------
CATALOG: dict[str, dict[str, str]] = {
    # ---- shared / common ---------------------------------------------------
    "common.home":            {"en": "Home",         "hi": "होम",            "mr": "मुख्यपृष्ठ"},
    "common.misActivity":     {"en": "MIS Activity", "hi": "एमआईएस गतिविधि", "mr": "एमआयएस अ‍ॅक्टिव्हिटी"},
    "common.futureModels":    {"en": "Future Models","hi": "फ्यूचर मॉडल्स",   "mr": "फ्युचर मॉडेल्स"},
    "common.cancel":          {"en": "Cancel",       "hi": "रद्द करें",       "mr": "रद्द करा"},
    "common.save":            {"en": "Save",         "hi": "सहेजें",          "mr": "जतन करा"},
    "common.submit":          {"en": "Submit",       "hi": "जमा करें",        "mr": "सादर करा"},
    "common.validate":        {"en": "Validate",     "hi": "सत्यापित करें",   "mr": "प्रमाणित करा"},
    "common.revoke":          {"en": "Revoke",       "hi": "निरस्त करें",     "mr": "रद्द करा"},
    "common.details":         {"en": "Details",      "hi": "विवरण",          "mr": "तपशील"},
    "common.accountDetails":  {"en": "Account Details", "hi": "खाता विवरण",  "mr": "खात्याचा तपशील"},
    "common.lienDetails":     {"en": "Lien Details", "hi": "ग्रहणाधिकार विवरण", "mr": "बोजा तपशील"},

    # ---- shared field labels ----------------------------------------------
    "fields.accountCode":     {"en": "Account Code", "hi": "खाता कोड",       "mr": "खाते कोड"},
    "fields.accountName":     {"en": "Account Name", "hi": "खाता नाम",       "mr": "खाते नाव"},
    "fields.name":            {"en": "Name",         "hi": "नाम",            "mr": "नाव"},
    "fields.ledgerBalance":   {"en": "Ledger Balance", "hi": "लेजर बैलेंस",  "mr": "लेजर शिल्लक"},
    "fields.availableBalance":{"en": "Available Balance", "hi": "उपलब्ध बैलेंस", "mr": "उपलब्ध शिल्लक"},
    "fields.loanAccountCode": {"en": "Loan Account Code", "hi": "ऋण खाता कोड", "mr": "कर्ज खाते कोड"},
    "fields.loanAccountName": {"en": "Loan Account Name", "hi": "ऋण खाता नाम", "mr": "कर्ज खाते नाव"},
    "fields.lienAmount":      {"en": "Lien Amount",  "hi": "ग्रहणाधिकार राशि", "mr": "बोजा रक्कम"},
    "fields.remark":          {"en": "Remark",       "hi": "टिप्पणी",        "mr": "शेरा"},
    "fields.serial":          {"en": "Serial",       "hi": "क्रम",           "mr": "क्रम"},

    # ---- account master ----------------------------------------------------
    "accountMaster.title":       {"en": "Account Master", "hi": "खाता मास्टर", "mr": "खाते मास्टर"},
    "accountMaster.breadcrumb":  {"en": "Account Master", "hi": "खाता मास्टर", "mr": "खाते मास्टर"},

    # ---- user master -------------------------------------------------------
    "userMaster.title":      {"en": "User Master", "hi": "यूज़र मास्टर", "mr": "युझर मास्टर"},
    "userMaster.breadcrumb": {"en": "User Master", "hi": "यूज़र मास्टर", "mr": "युझर मास्टर"},

    # ---- customer master ---------------------------------------------------
    "customerMaster.title":      {"en": "Customer Master", "hi": "कस्टमर मास्टर", "mr": "कस्टमर मास्टर"},
    "customerMaster.breadcrumb": {"en": "Customer Master", "hi": "कस्टमर मास्टर", "mr": "कस्टमर मास्टर"},

    # ---- branch master -----------------------------------------------------
    "branchMaster.title":        {"en": "Branch Master", "hi": "शाखा मास्टर", "mr": "शाखा मास्टर"},
    "branchMaster.breadcrumb":   {"en": "Branch Master", "hi": "शाखा मास्टर", "mr": "शाखा मास्टर"},
    "branchMaster.filters.branchCode":    {"en": "Branch Code",   "hi": "शाखा कोड",   "mr": "शाखा कोड"},
    "branchMaster.filters.branchName":    {"en": "Branch Name",   "hi": "शाखा नाम",   "mr": "शाखा नाव"},
    "branchMaster.filters.cityCode":      {"en": "City Code",     "hi": "शहर कोड",    "mr": "शहर कोड"},
    "branchMaster.filters.isImplemented": {"en": "Is Implemented","hi": "लागू है",    "mr": "अंमलात आणले"},

    # ---- global master -----------------------------------------------------
    "globalMaster.title": {"en": "Master Maintenance Global", "hi": "मास्टर मेंटेनेंस ग्लोबल", "mr": "जागतिक मास्टर मेंटेनन्स"},

    # ---- head office master ------------------------------------------------
    "headOfficeMaster.title": {"en": "Master Maintenance Head Office", "hi": "मास्टर मेंटेनेंस हेड ऑफिस", "mr": "मुख्य कार्यालय मास्टर मेंटेनन्स"},

    # ---- authorization -----------------------------------------------------
    "authorization.title":      {"en": "Authorization", "hi": "प्राधिकरण", "mr": "अधिकृतीकरण"},
    "authorization.breadcrumb": {"en": "Authorization", "hi": "प्राधिकरण", "mr": "अधिकृतीकरण"},

    # ---- futuremodels: term deposit close ----------------------------------
    "tdClose.title":      {"en": "Term Deposit Close", "hi": "मियादी जमा बंद करें", "mr": "मुदत ठेव बंद करा"},
    "tdClose.breadcrumb": {"en": "Term Deposit Close", "hi": "मियादी जमा बंद करें", "mr": "मुदत ठेव बंद करा"},

    # ---- futuremodels: standing instructions -------------------------------
    "standingInstructions.title":      {"en": "Standing Instructions", "hi": "स्थायी निर्देश", "mr": "स्थायी सूचना"},
    "standingInstructions.breadcrumb": {"en": "Standing Instructions", "hi": "स्थायी निर्देश", "mr": "स्थायी सूचना"},

    # ---- futuremodels: memo ------------------------------------------------
    "memo.title":            {"en": "Account Memo",  "hi": "खाता मेमो",     "mr": "हिशेबाची टीप"},
    "memo.accountCode":      {"en": "Account Code",  "hi": "खाता कोड",      "mr": "खात्याचा कोड"},
    "memo.name":             {"en": "Name",          "hi": "नाम",           "mr": "नाव"},
    "memo.memoDetails":      {"en": "Memo Details",  "hi": "मेमो विवरण",    "mr": "टीप तपशील"},
    "memo.detailsPlaceholder": {"en": "Details",     "hi": "विवरण",         "mr": "तपशील"},
    "memo.charactersOnly":   {"en": "{{count}} Characters Only", "hi": "केवल {{count}} अक्षर", "mr": "फक्त {{count}} अक्षरे"},

    # ---- futuremodels: lien mark (lean) ------------------------------------
    "lienMark.title": {"en": "Lien Mark", "hi": "ग्रहणाधिकार चिह्न", "mr": "बोजा नोंदवणे"},

    # ---- futuremodels: lien revoke (un-lean) -------------------------------
    "lienRevoke.title": {"en": "Lien Revoke Mark", "hi": "ग्रहणाधिकार निरस्त चिह्न", "mr": "बोजा काढल्याची नोंद"},

    # ---- futuremodels: td-calculate (maturity amount) ----------------------
    "tdCalculate.title":     {"en": "Maturity Amount", "hi": "परिपक्वता राशि", "mr": "परिपक्वतेची रक्कम"},
    "tdCalculate.subtitle":  {"en": "All Information's are related to Maturity Amount",
                              "hi": "सभी जानकारी परिपक्वता राशि से संबंधित है",
                              "mr": "सर्व माहिती परिपक्वतेच्या रकमेशी संबंधित आहे"},
    "tdCalculate.accountType":      {"en": "Account Type",      "hi": "खाता प्रकार",         "mr": "खात्याचा प्रकार"},
    "tdCalculate.productCode":      {"en": "Product Code",      "hi": "उत्पाद कोड",          "mr": "उत्पादन कोड"},
    "tdCalculate.productDescription": {"en": "Product Description", "hi": "उत्पाद विवरण",    "mr": "उत्पादन वर्णन"},
    "tdCalculate.categoryCode":     {"en": "Category Code",     "hi": "श्रेणी कोड",          "mr": "कॅटेगरी कोड"},
    "tdCalculate.openingDate":      {"en": "Opening Date",      "hi": "खोलने की तारीख",      "mr": "उद्घाटनाची तारीख"},
    "tdCalculate.unitOfPeriod":     {"en": "Unit Of Period",    "hi": "अवधि की इकाई",        "mr": "कालावधीचे एकक"},
    "tdCalculate.periodOfDeposit":  {"en": "Period of Deposit", "hi": "जमा की अवधि",         "mr": "ठेवींची कालावधी"},
    "tdCalculate.rate":             {"en": "Rate",              "hi": "दर",                  "mr": "दर"},
    "tdCalculate.interestFrequency":{"en": "Interest Payment frequency", "hi": "ब्याज भुगतान आवृत्ति", "mr": "व्याज भरण्याची वारंवारिता"},
    "tdCalculate.depositAmount":    {"en": "Deposit Amount",    "hi": "जमा राशि",            "mr": "ठेवी रक्कम"},
    "tdCalculate.maturityAmount":   {"en": "Maturity Amount",   "hi": "परिपक्वता राशि",      "mr": "परिपक्वतेची रक्कम"},
    "tdCalculate.maturityDate":     {"en": "Maturity Date",     "hi": "परिपक्वता तारीख",     "mr": "परिपक्वता तारीख"},
    "tdCalculate.subProductList":   {"en": "Sub Product List",  "hi": "उप उत्पाद सूची",      "mr": "उप उत्पादन यादी"},
    "tdCalculate.descriptionCol":   {"en": "Description",       "hi": "विवरण",               "mr": "वर्णन"},

    # ---- dashboard ---------------------------------------------------------
    "dashboard.title": {"en": "Dashboard", "hi": "डैशबोर्ड", "mr": "डॅशबोर्ड"},
}

# ----------------------------------------------------------------------------
# Extraction patterns (for the coverage report)
# ----------------------------------------------------------------------------
PATTERNS = {
    "titleEn":   re.compile(r'titleEn\s*=\s*"([^"]+)"'),
    "titleHi":   re.compile(r'titleHi\s*=\s*"([^"]+)"'),
    "labelHi":   re.compile(r'labelHi\s*=\s*"([^"]+)"'),
    "label":     re.compile(r'\blabel\s*[:=]\s*"([^"]+)"'),
    "fieldLabel":re.compile(r'<Field\s+label="([^"]+)"'),
    "nativeSpan":re.compile(r'<span[^>]*>\s*([^<>{}]*[ऀ-ॿ][^<>{}]*?)\s*</span>'),
}


def extract_strings() -> dict:
    """Scan tsx files and collect candidate strings for the coverage report."""
    report: dict[str, dict] = {}
    for path in sorted(PAGES_DIR.rglob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        found: dict[str, list[str]] = {}
        for name, pat in PATTERNS.items():
            hits = [m.strip() for m in pat.findall(text) if m.strip()]
            if hits:
                found[name] = sorted(set(hits))
        if found:
            report[rel] = found
    return report


def unflatten(flat: dict[str, str]) -> dict:
    """Turn dotted keys into nested dicts."""
    nested: dict = {}
    for dotted, value in flat.items():
        node = nested
        parts = dotted.split(".")
        for part in parts[:-1]:
            node = node.setdefault(part, {})
        node[parts[-1]] = value
    return nested


def build_locale(lang: str) -> dict:
    return unflatten({k: v[lang] for k, v in CATALOG.items()})


def main() -> None:
    LOCALES_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Coverage report
    report = extract_strings()
    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    # 2. Locale files
    for lang in ("en", "hi", "mr"):
        out = LOCALES_DIR / f"{lang}.json"
        out.write_text(
            json.dumps(build_locale(lang), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    # 3. Summary
    total_native = sum(len(v.get("titleHi", [])) + len(v.get("labelHi", [])) + len(v.get("nativeSpan", []))
                       for v in report.values())
    print(f"Scanned files with strings : {len(report)}")
    print(f"Catalog keys generated     : {len(CATALOG)}")
    print(f"Native strings detected    : {total_native}")
    print(f"Report written             : {REPORT_FILE.relative_to(ROOT)}")
    print(f"Locales written            : {', '.join(l.name for l in sorted(LOCALES_DIR.glob('*.json')))}")


if __name__ == "__main__":
    main()
