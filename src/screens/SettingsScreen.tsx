import React from 'react';
import { Alert } from 'react-native';

import Box from '../components/Box/Box';
import Button from '../components/Button/Button';
import { ListItem } from '../components/ListItem/ListItem';
import Text from '../components/Text/Text';
import i18n, { t } from '../i18n/i18n';
import { useAuthStore } from '../store/AuthStore';

export const SettingsScreen: React.FC = () => {
  const { doLogout } = useAuthStore(({ doLogout }) => ({ doLogout }));

  const selectableLanguages = [
    {
      id: 'nl',
      title: t('languages.nl'),
    },
    {
      id: 'en',
      title: t('languages.en'),
    },
  ];

  const onChangeLanguage = (_locale: string) => {
    Alert.alert('TODO', 'Still needs to be implemented.');
  };

  const confirmBeforeLogout = () => {
    Alert.alert(
      t('logout_confirm.title'),
      t('logout_confirm.message'),
      [
        {
          style: 'cancel',
          text: t('logout_confirm.cancel_button'),
        },
        {
          onPress: () => doLogout(),
          style: 'destructive',
          text: t('logout_confirm.confirm_button'),
        },
      ],
    );
  };

  return (
    <Box>
      <Box py={16} px={42}>
        <Text variant="bodyRegularBold">{t('settings.language_subtitle')}</Text>
      </Box>
      {selectableLanguages.map((item, index) => (
        <ListItem
          key={item.id}
          variant="checkbox"
          isChecked={item.id === i18n.locale}
          isEven={index % 2 === 0}
          title={item.title}
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
