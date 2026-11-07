// The only module that reads content collections. Pages ask it what to list and
// what to build, and the rules behind those answers live in rules.ts.
import { getCollection } from 'astro:content';
import {
	entriesWithPages,
	isRoleScheduled,
	isScheduled,
	latestRole as findLatestRole,
	listedEntries,
	listedRoles as findListedRoles,
} from './rules';

// One date per build, so every page agrees on what has been published.
const now = new Date();

export const listedProjects = async () => listedEntries(await getCollection('projects'), now);

export const listedPosts = async () => listedEntries(await getCollection('blog'), now);

export const listedRoles = async () => findListedRoles(await getCollection('employment'), now);

export const latestRole = async () => findLatestRole(await getCollection('employment'), now);

export const projectPages = async () =>
	entriesWithPages(await getCollection('projects')).map((entry) => ({
		entry,
		scheduled: isScheduled(entry, now),
	}));

export const postPages = async () =>
	entriesWithPages(await getCollection('blog')).map((entry) => ({
		entry,
		scheduled: isScheduled(entry, now),
	}));

export const rolePages = async () =>
	(await getCollection('employment')).map((entry) => ({
		entry,
		scheduled: isRoleScheduled(entry, now),
	}));
