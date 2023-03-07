import * as SecureStore from 'expo-secure-store';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StatusBar } from 'react-native';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { ListItem } from '../components/ListItem/ListItem';
import Text from '../components/Text/Text';
import { storeKeyLanguage } from '../constants';
import { useApiStore } from '../store/ApiStore';

export const SettingsScreen: React.FC = () => {
  const { clearRefreshToken } = useApiStore();
  const { t, i18n } = useTranslation();

  const selectableLanguages = [
    {
      id: 'nl',
      subTitle: t('languages.nl'),
      title: 'Nederlands',
    },
    {
      id: 'en',
      subTitle: t('languages.en'),
      title: 'English',
    },
  ];

  const onChangeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);

    // save settings to secure store (if more settings is coming we should move this to normal local storage)
    SecureStore.setItemAsync(storeKeyLanguage, locale);
  };

  const confirmBeforeLogout = () => {
    Alert.alert(
      t('logout_confirm.title'),
      t('logout_confirm.message') ?? '',
      [
        {
          style: 'cancel',
          text: t('logout_confirm.cancel_button') ?? '',
        },
        {
          onPress: () => clearRefreshToken(),
          style: 'destructive',
          text: t('logout_confirm.confirm_button') ?? '',
        },
      ],
    );
  };

  return (
    <Box>
      <StatusBar barStyle="default" animated />
      <Box py={16} px={42}>
        <Text variant="bodyRegularBold">{t('settings.language_subtitle')}</Text>
      </Box>
      {selectableLanguages.map((item, index) => (
        <ListItem
          key={item.id}
          variant="checkbox"
          isChecked={item.id === i18n.language}
          isEven={index % 2 === 0}
          title={item.title}
          subTitle={item.subTitle}
          onPress={() => onChangeLanguage(item.id)}
        />
      ))}
      <Box py={24} px={24}>
        <Button
          variant="secondary"
          size="M"
          title={t('settings.logout')}
          onPress={() => confirmBeforeLogout()}
        />
      </Box>
    </Box>
  );
};
