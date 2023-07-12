import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { apiConversion, authConstants, lngConvert } from '../../constants';
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
}

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
}

const isUrlFromLogin = (url: string) => {
  return (url.startsWith(authConstants.loginPage));
};

const urlToApiUrl = (url: string) => {
  const foundUrls = Object.keys(apiConversion).filter((value) => url.startsWith(value));

  if (foundUrls.length > 0) {
    return apiConversion[foundUrls[0]];
  }

  return url;
};

// check if code is redirect (-9 = android, -1007 is iOS)
const isTooManyRedirectError = (code: number) => (code === -9 || code === -1007);

const LoginSite: React.FC<LoginSiteProps> = ({ mode, refreshToken, onRefreshToken }) => {
  const webViewRef = useRef<WebView>(null);
  const [webViewError, setWebViewError] = useState<WebViewError| undefined>();
  const [uri, setUri] = useState(mode === 'environment' ? authConstants.swithcEnvironment : authConstants.loginPage);
  const { i18n } = useTranslation();
  const locale = lngConvert[i18n.language];

  const defaultHeaders = {
    'Accept-Language': locale + ',' + i18n.language + ';q=0.5',
  };

  const headers = mode === 'environment'
    ? {
      ...defaultHeaders,
      Cookie: makeCookies([
        {
          name: 'refresh_token',
          value: refreshToken ?? '',
        },
      ]),
    }
    : defaultHeaders;
  return (
    <>
      <WebView
        ref={webViewRef}
        incognito={true}
        style={styles.webView}
        source={{
          headers,
          uri,
        }}
        startInLoadingState={true}
        renderLoading={() => <LoginSiteLoader />}
        injectedJavaScript={LOGIN_COOKIE_READER}
        setBuiltInZoomControls={false}
        onShouldStartLoadWithRequest={(request) => {
          if (!isUrlFromLogin(request.url) && request.navigationType === 'click') {
            Linking.openURL(request.url);
            return false;
          }
          return true;
        }}
        renderError={() => (<></>)}
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
          if (!isUrlFromLogin(url)) {
            const { refresh_token } = parseCookies(cookieData);
            if (refresh_token) {
              onRefreshToken(refresh_token, urlToApiUrl(url));
            }
          }
        }}
        hideKeyboardAccessoryView
      />
      {webViewError && (
        <LoginSiteError
          errorName={webViewError.errorName}
          errorCode={webViewError.errorCode}
          errorDescription={webViewError.errorDescription}
          onRetry={() => {
            const isToManyRedirects = isTooManyRedirectError(webViewError.errorCode);
            if (isToManyRedirects) {
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
