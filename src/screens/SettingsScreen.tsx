import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { ListItemCheckbox } from '@/components/ListItemCheckbox/ListItemCheckbox';
import { ListItemHeader } from '@/components/ListItemHeader/ListItemHeader';
import { useSettingsStore } from '@/store/SettingsStore';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { ListItem } from '../components/ListItem/ListItem';
import Text from '../components/Text/Text';
import { storeKeyLanguage } from '../constants';
import { useApiStore } from '../store/ApiStore';
import { colors } from '../theme';

export const SettingsScreen: React.FC = () => {
  const { clearRefreshToken } = useApiStore();
  const { t, i18n } = useTranslation();
  const settings = useSettingsStore((state) => state.settings);
  const setSetting = useSettingsStore((state) => state.setSetting);
  const resetSettings = useSettingsStore((state) => state.reset);

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
    Alert.alert(t('logout_confirm.title'), t('logout_confirm.message'), [
      {
        style: 'cancel',
        text: t('logout_confirm.cancel_button'),
      },
      {
        onPress: () => {
          clearRefreshToken();
          resetSettings();
        },
        style: 'destructive',
        text: t('logout_confirm.confirm_button'),
      },
    ]);
  };

  return (
    <Box>
      <StatusBar animated style="dark" />
      <ListItemHeader title={t('settings.language_subtitle')} />
      {selectableLanguages.map((item, index) => (
        <ListItem
          key={item.id}
          isChecked={item.id === i18n.language}
          isEven={index % 2 === 0}
          subTitle={item.subTitle}
          title={item.title}
          variant="checkbox"
          onPress={() => onChangeLanguage(item.id)}
        />
      ))}
      <ListItemHeader title={t('settings.other_subtitle')} />
      <ListItemCheckbox
        isChecked={settings.saveToCameraRoll}
        isEven={false}
        title={t('settings.setting_savetocameraroll')}
        variant="checkbox"
        onChecked={(isChecked) => {
          setSetting('saveToCameraRoll', isChecked);
        }}
      />
      <Box px={24} py={24}>
        <Button size="M" title={t('settings.logout')} variant="secondary" onPress={() => confirmBeforeLogout()} />
      </Box>
      <Box px={42}>
        <Text color={colors.labelLightSecondary} variant="caption1Regular">
          {t('settings.version')}: {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
        </Text>
      </Box>
    </Box>
  );
};
