/**
 * Fallback declaration for extensions: most files of the libraries are still JavaScript without
 * type declarations. Imports of them resolve to `any` through this pattern instead of failing
 * with TS7016. Typed files keep their own types, since a resolved declaration wins over a pattern.
 * It has to stay a pattern with "*": a declaration for an exact module name would hide the real
 * types of that module. Loaded by tsconfig.extension.json.
 */
declare module '@shopgate/*';
