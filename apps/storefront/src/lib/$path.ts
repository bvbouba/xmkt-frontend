export const pagesPath = {
  "aboutUs": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/aboutUs' as const, hash: url?.hash })
  },
  "auth": {
    "login": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/login' as const, hash: url?.hash })
    },
    "signup": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/signup' as const, hash: url?.hash })
    }
  },
  "shop": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/shop' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/' as const, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;
