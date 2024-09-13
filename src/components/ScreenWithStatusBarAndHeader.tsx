import type React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, dimensions } from '../theme';
import { PageHeader } from './PageHeader/PageHeader';

type Props = {
  headerElement?: React.ReactNode;
};

export const ScreenWithStatusBarAndHeader: React.FC<React.PropsWithChildren<Props>> = ({ headerElement, children }) => {
  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={styles.safeAreaView}>
        <StatusBar animated backgroundColor="black" barStyle="light-content" />
      </SafeAreaView>
      <PageHeader buttonContainer={headerElement} />
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: 30,
    top: 24,
  },
  contentContainer: {
    flex: 1,
    padding: dimensions.spacing.wide,
  },

  safeAreaView: {
    backgroundColor: 'black',
  },
  screenContainer: {
    backgroundColor: colors.screen.background,
    color: colors.screen.text,
    flex: 1,
  },
});
