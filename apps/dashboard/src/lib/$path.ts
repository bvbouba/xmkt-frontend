const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  _lng: (lng: string | number) => ({
    "about": {
      $url: (url?: { hash?: string }) => ({ pathname: '/[lng]/about' as const, query: { lng }, hash: url?.hash, path: `/${lng}/about${buildSuffix(url)}` })
    },
    "contact": {
      $url: (url?: { hash?: string }) => ({ pathname: '/[lng]/contact' as const, query: { lng }, hash: url?.hash, path: `/${lng}/contact${buildSuffix(url)}` })
    },
    "course": {
      $url: (url?: { hash?: string }) => ({ pathname: '/[lng]/course' as const, query: { lng }, hash: url?.hash, path: `/${lng}/course${buildSuffix(url)}` })
    },
    "login": {
      $url: (url?: { hash?: string }) => ({ pathname: '/[lng]/login' as const, query: { lng }, hash: url?.hash, path: `/${lng}/login${buildSuffix(url)}` })
    },
    "profile": {
      $url: (url?: { hash?: string }) => ({ pathname: '/[lng]/profile' as const, query: { lng }, hash: url?.hash, path: `/${lng}/profile${buildSuffix(url)}` })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/[lng]' as const, query: { lng }, hash: url?.hash, path: `/${lng}${buildSuffix(url)}` })
  }),
};

export type PagesPath = typeof pagesPath;
