export type Dictionary<TKey extends string | number, TValue> = {
  [K in TKey]: TValue;
};
