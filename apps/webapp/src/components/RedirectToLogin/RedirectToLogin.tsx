import { isAuthenticated } from '@/lib/auth';
import usePaths from '@/lib/paths';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const RedirectToLogin: React.FC = () => {
  const router = useRouter();
  const paths = usePaths()
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(paths.auth.login.$url()); // Redirect to your login page
    }
  }, [router,paths.auth.login]);

  return null;
};

export default RedirectToLogin;