import { MESSAGES } from "./messages";
type DeepKeys<T> = {
    [K in keyof T & string]: T[K] extends Record<string, any> ? `${K}.${DeepKeys<T[K]>}` : K;
}[keyof T & string];
type MessagePath = DeepKeys<typeof MESSAGES>;
export declare const t: (path: MessagePath) => string;
export {};
//# sourceMappingURL=index.d.ts.map