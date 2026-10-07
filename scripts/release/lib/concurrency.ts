/**
 * Maps items with an async function, running at most `limit` calls at the same time.
 * @param items The items.
 * @param limit Maximum number of calls at the same time.
 * @param fn Maps a single item.
 * @returns The results in the order of the items.
 */
export const mapWithLimit = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;

  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      // eslint-disable-next-line no-await-in-loop
      results[index] = await fn(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};
