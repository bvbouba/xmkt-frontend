export const pagesPath = {
  "aboutUs": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/aboutUs' as const, hash: url?.hash })
  },
  "auth": {
    "confirmEmail": {
      _key: (key: string | number) => ({
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/confirmEmail/[key]' as const, query: { key }, hash: url?.hash })
      })
    },
    "login": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/login' as const, hash: url?.hash })
    },
    "signup": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/signup' as const, hash: url?.hash })
    },
    "verifyEmailDone": {
      $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/verifyEmailDone' as const, hash: url?.hash })
    }
  },
  "shop": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/shop' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/' as const, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;
