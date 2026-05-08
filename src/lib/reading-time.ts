/**
 * Estimate reading time in minutes for a string of markdown/text.
 * Defaults to 225 words per minute.
 */
export function readingTime(content: string, wpm = 225): number {
  const words = content
    .replace(/```[\s\S]*?```/g, '') // strip code blocks
    .replace(/<[^>]+>/g, '')        // strip HTML/JSX tags
    .replace(/[#>*_~`-]/g, '')      // strip markdown punctuation
    .split(/\s+/)
    .filter(Boolean)
    .length;
  return Math.max(1, Math.round(words / wpm));
}
