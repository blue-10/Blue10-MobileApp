import Constants from 'expo-constants';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { authConstants, lngConvert } from '../../constants';
import { makeCookies, parseCookies } from '../../utils/cookiesUtils';
import LoginSiteError from './LoginSiteError';
import LoginSiteLoader from './LoginSiteLoader';

type LoginSiteProps = {
  /**
   * set the mode the component must be running on mount.
   * login = is show the login page,
   * environment = is show the switch environment.
   */
  mode: 'environment' | 'login';
  /** refresh token to use */
  refreshToken?: string;
  /** refresh token to use for access token, domain is used for which api you need to get it. */
  onRefreshToken: (refreshToken: string, domain: string) => void;
};

// script that is used in the webview to send the document cookie to the app.
const LOGIN_COOKIE_READER = `
(function() {
  window.ReactNativeWebView.postMessage(document.cookie);
})();
`;

type WebViewError = {
  errorName?: string;
  errorCode: number;
  errorDescription: string;
};

const isUrlFromLogin = (url: string) => {
  return url.startsWith(authConstants.loginPage);
};

const urlToApiUrl = (url: string) => {
  const urlParts = url.split('.');

  if (urlParts[0].endsWith('-ws')) {
    return url;
  }

  if (urlParts[0].endsWith('-classic')) {
    urlParts[0] = urlParts[0].substring(0, urlParts[0].lastIndexOf('-classic'));
  }

  urlParts[0] = `${urlParts[0]}-ws`;
  return urlParts.join('.');
};

// check if code is redirect (-9 = android, -1007 is iOS)
const isTooManyRedirectError = (code: number) => code === -9 || code === -1007;

const LoginSite: React.FC<LoginSiteProps> = ({ mode, refreshToken, onRefreshToken }) => {
  const webViewRef = useRef<WebView>(null);
  const [webViewError, setWebViewError] = useState<WebViewError | undefined>();
  const [uri, setUri] = useState(mode === 'environment' ? authConstants.switchEnvironment : authConstants.loginPage);
  const { i18n } = useTranslation();
  const locale = lngConvert[i18n.language];

  const defaultHeaders = {
    'Accept-Language': `${locale},${i18n.language};q=0.5`,
    'Blue10-Mobile-App-Version': Constants.expoConfig?.version || 'onbekend',
  };

  // note: these headers will only be sent to the initial URL, not to any follow-up URLs the user clicks. To fix that,
  // we could implement logic in onShouldStartLoadWithRequest but this breaks the injected javascript to send the
  // cookies to onMessage. Keeping track of the Blue10-Mobile-App-Version header to indicate a user came from the
  // mobile app is currently implemented on the backend by Alain.
  // @see https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md under the header
  // Working with custom headers, sessions, and cookies
  const envHeaders = {
    ...defaultHeaders,
    Cookie: makeCookies([
      {
        name: 'refresh_token',
        value: refreshToken ?? '',
      },
    ]),
  };
  const headers = mode === 'environment' ? envHeaders : defaultHeaders;
  return (
    <>
      <WebView
        ref={webViewRef}
        hideKeyboardAccessoryView
        incognito={true}
        injectedJavaScript={LOGIN_COOKIE_READER}
        renderError={() => <></>}
        renderLoading={() => <LoginSiteLoader />}
        setBuiltInZoomControls={false}
        userAgent='https://accounts.google.com/'
        source={{
          headers,
          uri,
        }}
        startInLoadingState={true}
        style={styles.webView}
        onError={(event) => {
          const { nativeEvent } = event;
          setWebViewError({
            errorCode: nativeEvent.code,
            errorDescription: nativeEvent.description,
            errorName: nativeEvent.domain,
          });
        }}
        onMessage={(data) => {
          const { url, data: cookieData } = data.nativeEvent;
          if (url && !isUrlFromLogin(url)) {
            const { refresh_token } = parseCookies(cookieData);
            if (refresh_token) {
              onRefreshToken(refresh_token, urlToApiUrl(url));
            }
          }
        }}
        onShouldStartLoadWithRequest={() => true}
      />
      {webViewError && (
        <LoginSiteError
          errorCode={webViewError.errorCode}
          errorDescription={webViewError.errorDescription}
          errorName={webViewError.errorName}
          onRetry={() => {
            const isTooManyRedirects = isTooManyRedirectError(webViewError.errorCode);
            if (isTooManyRedirects) {
              // there is no function to navigate to page. so we just change the uri to about:blank and back.
              setUri('about:blank');
              requestAnimationFrame(() => setUri(authConstants.loginPage));
            } else {
              webViewRef.current?.reload();
            }
            setWebViewError(undefined);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});

export default LoginSite;
