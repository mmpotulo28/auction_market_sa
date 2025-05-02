/**
 * Converts a given string into a URL-friendly format.
 *
 * The function transforms the input string to lowercase, replaces
 * non-alphanumeric characters with hyphens, and removes leading
 * or trailing hyphens.
 *
 * @param str - The input string to be converted.
 * @returns The URL-friendly version of the input string.
 */
export const stringToUrl = (str: string): string => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
};
