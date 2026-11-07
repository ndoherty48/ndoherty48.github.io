// The rules for what the site lists and builds. See CONTEXT.md for the terms.
// Plain functions over entries and a date, so tests can run them without Astro.

interface Publishable {
	data: {
		hidden: boolean;
		publishDate: Date;
		lastModifiedDate?: Date | undefined;
	};
}

interface Role {
	data: {
		startDate: Date;
	};
}

const latestActivity = ({ data }: Publishable) =>
	Math.max(data.publishDate.valueOf(), data.lastModifiedDate?.valueOf() ?? 0);

const hasStarted = (role: Role, now: Date) => role.data.startDate <= now;

export const isScheduled = (entry: Publishable, now: Date) =>
	!entry.data.hidden && entry.data.publishDate > now;

export const isRoleScheduled = (role: Role, now: Date) => !hasStarted(role, now);

export const entriesWithPages = <T extends Publishable>(entries: T[]) =>
	entries.filter((entry) => !entry.data.hidden);

export const listedEntries = <T extends Publishable>(entries: T[], now: Date) =>
	entriesWithPages(entries)
		.filter((entry) => !isScheduled(entry, now))
		.sort((a, b) => latestActivity(b) - latestActivity(a));

export const listedRoles = <T extends Role>(roles: T[], now: Date) =>
	roles
		.filter((role) => hasStarted(role, now))
		.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

export const latestRole = <T extends Role>(roles: T[], now: Date): T | undefined =>
	listedRoles(roles, now)[0];
