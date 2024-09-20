export const pagesPath = {
  "about_us": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/about-us' as const, hash: url?.hash })
  },
  "auth": {
    "confirm_email": {
      _key: (key: string | number) => ({
        $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/auth/confirm-email/[key]' as const, query: { key }, hash: url?.hash })
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
  $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/' as const, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;
