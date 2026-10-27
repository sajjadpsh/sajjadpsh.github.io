const month = (ym: string, intl: string) =>
  new Intl.DateTimeFormat(intl, { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${ym}-01T00:00:00Z`));

/** "2025-05", "2025-07" -> "May 2025 – Jul 2025" in the given Intl locale; no end = present. */
export const formatPeriod = (start: string, end: string | undefined, intl: string, present: string) =>
  `${month(start, intl)} – ${end ? month(end, intl) : present}`;
