export const DEFAULT_WEDDING_DATE = "2026-11-21";

// Share a different date with ?YYYY-MM-DD or ?source=YYYY-MM-DD. The ceremony starts at
// 18:00 in Uzbekistan, regardless of the guest's device timezone.
export function getWeddingDate(search = "") {
  const params = new URLSearchParams(search);
  const source = params.get("source")
    ?? [...params.keys()].find((key) => /^\d{4}-\d{2}-\d{2}$/.test(key))
    ?? "";
  const candidate = /^\d{4}-\d{2}-\d{2}$/.test(source)
    ? new Date(`${source}T00:00:00Z`)
    : null;
  const valid = candidate && !Number.isNaN(candidate.getTime())
    && candidate.toISOString().slice(0, 10) === source
    && candidate.getUTCFullYear() >= 1000;
  const iso = valid ? source : DEFAULT_WEDDING_DATE;
  const [year, month, day] = iso.split("-").map(Number);
  return {
    iso,
    year,
    month,
    day,
    dayLabel: String(day).padStart(2, "0"),
    monthLabel: String(month).padStart(2, "0"),
    instant: new Date(`${iso}T18:00:00+05:00`),
    calendarDate: new Date(`${iso}T00:00:00Z`),
    daysInMonth: new Date(Date.UTC(year, month, 0)).getUTCDate(),
    firstColumn: (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7 + 1,
  };
}

export function getWeddingVenue(date) {
  if (date.iso === "2026-11-20") {
    return {
      name: "OSIYO to‘yxonasi",
      image: "/images/osiyo.png",
      googleMaps: "https://maps.app.goo.gl/DwSiA2fH4AZshDgS8",
      yandexMaps: "https://yandex.uz/maps/-/CXrUqL7G",
    };
  }
  return {
    name: null,
    image: "/images/turkiston.jpg",
    googleMaps: "https://maps.app.goo.gl/pX7tTPts39B2FH7G7",
    yandexMaps: "https://yandex.uz/maps/-/CXrMaP9S",
  };
}

export function getMonthLabel(date, language) {
  const locale = { UZ: "uz-Latn", RU: "ru", EN: "en" }[language];
  const month = new Intl.DateTimeFormat(locale, {
    month: "long", timeZone: "UTC",
  }).format(date.calendarDate);
  return `${month.toLocaleUpperCase(locale)} ${date.year}`;
}
