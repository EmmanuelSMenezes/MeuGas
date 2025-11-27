import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from 'src/auth/useAuthContext';
import { getPartnerStyle } from 'src/service/session';
import { useSettingsContext } from 'src/components/settings';
import { PATH_AFTER_LOGIN } from '../../config-global';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();
  const { user, token, partnerId } = useAuthContext();

  const { setExternalTheme } = useSettingsContext();

  useEffect(() => {
    const getPlataformStyle = async () => {
      try {
        const response = await getPartnerStyle(partnerId?.admin_id);
        localStorage.setItem('GeneralStyle', JSON.stringify(response));
        setExternalTheme(response);
      } catch (error) {
        console.log(error);
      }
    };

    if (user && token) {
      getPlataformStyle();
    }
  }, [user, token, partnerId, setExternalTheme]);

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.root) {
      replace(PATH_AFTER_LOGIN);
    }
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AFTER_LOGIN);
  }, []);

  return null;
}
