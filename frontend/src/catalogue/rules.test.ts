import { describe, expect, it } from 'vitest';
import {
	isRoleScheduled,
	isScheduled,
	latestRole,
	listedEntries,
	listedRoles,
	entriesWithPages,
} from './rules';

const date = (iso: string) => new Date(`${iso}T00:00:00Z`);

const entry = (
	id: string,
	publishDate: string,
	options: { hidden?: boolean; lastModifiedDate?: string } = {},
) => ({
	id,
	data: {
		hidden: options.hidden ?? false,
		publishDate: date(publishDate),
		lastModifiedDate: options.lastModifiedDate ? date(options.lastModifiedDate) : undefined,
	},
});

const role = (id: string, startDate: string, endDate?: string) => ({
	id,
	data: { startDate: date(startDate), endDate: endDate ? date(endDate) : undefined },
});

const ids = (items: { id: string }[]) => items.map((item) => item.id);

describe('listed entries', () => {
	it('leaves a scheduled entry out until its publish date arrives', () => {
		const post = entry('post', '2027-03-10');

		expect(ids(listedEntries([post], date('2027-03-09')))).toEqual([]);
		expect(ids(listedEntries([post], date('2027-03-10')))).toEqual(['post']);
		expect(ids(listedEntries([post], date('2027-03-11')))).toEqual(['post']);
	});

	it('never lists a hidden entry', () => {
		const post = entry('post', '2020-01-01', { hidden: true });

		expect(listedEntries([post], date('2027-01-01'))).toEqual([]);
	});

	it('orders by latest activity, most recent first', () => {
		const updatedLater = entry('updated-later', '2025-07-14', { lastModifiedDate: '2026-05-26' });
		const publishedBetween = entry('published-between', '2025-12-27');
		const newest = entry('newest', '2026-09-19');

		const listed = listedEntries([updatedLater, publishedBetween, newest], date('2027-01-01'));

		expect(ids(listed)).toEqual(['newest', 'updated-later', 'published-between']);
	});

	it('does not change the array it is given', () => {
		const entries = [entry('older', '2020-01-01'), entry('newer', '2021-01-01')];

		listedEntries(entries, date('2027-01-01'));

		expect(ids(entries)).toEqual(['older', 'newer']);
	});
});

describe('entries with pages', () => {
	it('gives published and scheduled entries a page, but not hidden ones', () => {
		const published = entry('published', '2020-01-01');
		const scheduled = entry('scheduled', '2099-01-01');
		const hidden = entry('hidden', '2020-01-01', { hidden: true });
		const hiddenAndFuture = entry('hidden-and-future', '2099-01-01', { hidden: true });

		const withPages = entriesWithPages([published, scheduled, hidden, hiddenAndFuture]);

		expect(ids(withPages)).toEqual(['published', 'scheduled']);
	});
});

describe('scheduled', () => {
	it('applies only until the publish date arrives', () => {
		const post = entry('post', '2027-03-10');

		expect(isScheduled(post, date('2027-03-09'))).toBe(true);
		expect(isScheduled(post, date('2027-03-10'))).toBe(false);
		expect(isScheduled(post, date('2027-03-11'))).toBe(false);
	});

	it('does not apply to a hidden entry', () => {
		const post = entry('post', '2027-03-10', { hidden: true });

		expect(isScheduled(post, date('2027-03-09'))).toBe(false);
	});

	it('applies to a role until its start date arrives', () => {
		const job = role('job', '2027-02-01');

		expect(isRoleScheduled(job, date('2027-01-31'))).toBe(true);
		expect(isRoleScheduled(job, date('2027-02-01'))).toBe(false);
	});
});

describe('listed roles', () => {
	it('lists started roles by start date, most recent first, leaving out future roles', () => {
		const first = role('first', '2019-07-15', '2021-06-30');
		const second = role('second', '2023-04-01', '2026-11-30');
		const future = role('future', '2027-02-01');

		expect(ids(listedRoles([first, future, second], date('2027-01-01')))).toEqual([
			'second',
			'first',
		]);
	});
});

describe('latest role', () => {
	const ended = role('ended', '2023-04-01', '2026-11-30');
	const older = role('older', '2019-07-15', '2021-06-30');

	it('is still the most recent role after that role has ended', () => {
		expect(latestRole([older, ended], date('2026-12-15'))?.id).toBe('ended');
	});

	it('ignores a role that has not started', () => {
		const future = role('future', '2027-02-01');

		expect(latestRole([older, ended, future], date('2027-01-31'))?.id).toBe('ended');
		expect(latestRole([older, ended, future], date('2027-02-01'))?.id).toBe('future');
	});

	it('is undefined when there are no roles', () => {
		expect(latestRole([], date('2027-01-01'))).toBeUndefined();
	});

	it('is undefined when no role has started', () => {
		expect(latestRole([role('future', '2099-01-01')], date('2027-01-01'))).toBeUndefined();
	});
});
