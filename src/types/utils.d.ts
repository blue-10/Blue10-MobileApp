type Dot<T extends string, U extends string> = '' extends U ? T : `${T}.${U}`;

type PathsToProps<T, V> = T extends V
  ? ''
  : { [K in Extract<keyof T, string>]: Dot<K, PathsToProps<T[K], V>> }[Extract<keyof T, string>];
