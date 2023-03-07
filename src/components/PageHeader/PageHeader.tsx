import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

// @ts-ignore
import logo from '../../../assets/logo.png';

type Props = {
  buttonContainer?: React.ReactNode;
}

export const PageHeader: React.FC<Props> = ({ buttonContainer }) => {
  return (
    <View style={styles.headerContainer}>
      <Svg style={styles.svg} height="100%" width="100%">
        <Rect x="-20" y="0" width="150%" height="120" stroke="black" strokeWidth="2" fill="black" rotation={-10} />
      </Svg>
      <Image resizeMode="cover" style={styles.logo} source={logo} />
      {buttonContainer && (<View style={styles.buttonContainer}>{buttonContainer}</View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: 30,
    top: 24,
  },
  headerContainer: {
    height: 123,
  },
  logo: {
    height: 120,
    left: 14,
    position: 'absolute',
    width: 110,
  },
  svg: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
