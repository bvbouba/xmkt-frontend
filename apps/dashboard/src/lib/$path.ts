const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  "about": {
    $url: (url?: { hash?: string }) => ({ pathname: '/about' as const, hash: url?.hash, path: `/about${buildSuffix(url)}` })
  },
  "contact": {
    $url: (url?: { hash?: string }) => ({ pathname: '/contact' as const, hash: url?.hash, path: `/contact${buildSuffix(url)}` })
  },
  "course": {
    $url: (url?: { hash?: string }) => ({ pathname: '/course' as const, hash: url?.hash, path: `/course${buildSuffix(url)}` })
  },
  "profile": {
    $url: (url?: { hash?: string }) => ({ pathname: '/profile' as const, hash: url?.hash, path: `/profile${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash, path: `/${buildSuffix(url)}` })
};

export type PagesPath = typeof pagesPath;
