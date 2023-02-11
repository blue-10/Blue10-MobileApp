import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button/Button';
import { ScreenWithStatusBarAndHeader } from '../components/ScreenWithStatusBarAndHeader';
import TextInput from '../components/TextInput/TextInput';
import { t } from '../i18n/i18n';
import { useAuthStore } from '../store/AuthStore';
import { app, dimensions } from '../theme';

export const LoginScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>('kminchelle');
  const [password, setPassword] = useState<string>('0lelplR');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setLoggingIn] = useState<boolean>(false);

  const { doLogin, loadFromStore } = useAuthStore(({ doLogin, loadFromStore }) => ({ doLogin, loadFromStore }));

  const login = async () => {
    try {
      setLoggingIn(true);
      await doLogin(userName, password);
    } catch (e) {
      setErrorMessage('Invalid username or password');
    }

    setLoggingIn(false);
  };

  useEffect(() => {
    loadFromStore();
  }, [loadFromStore]);

  return (
    <ScreenWithStatusBarAndHeader>
      <>
        <Text style={app.headerText}>{t('login.welcome_title')}</Text>
        <Text style={app.subTitleText}>{t('login.welcome_description')}</Text>
        <View style={styles.textInputGroup}>
          <TextInput
            value={userName}
            onChangeText={(value) => setUserName(value)}
            label={t('login.email')}
          />
          <TextInput
            value={password}
            onChangeText={(value) => setPassword(value)}
            isSecureTextEntry={true}
            label={t('login.password')}
          />
        </View>
        <Button
          variant="primary"
          size="L"
          isLoading={isLoggingIn}
          title={t('login.login')}
          onPress={login}
        />

        {errorMessage ? <Text style={app.errorText}>{errorMessage}</Text> : null}
      </>
    </ScreenWithStatusBarAndHeader>
  );
};

const styles = StyleSheet.create({
  textInputGroup: {
    marginBottom: dimensions.spacing.size2,
    marginTop: dimensions.spacing.normal,
  },
});
