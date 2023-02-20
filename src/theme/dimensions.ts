const defaultFontSize = 14;
const mediumFontSize = 18;
const largeFontSize = 20;
const extraLargeFontSize = 30;
const space = 20;
const narrowSpace = 10;
const wideSpace = 30;

export const dimensions = {
  button: {
    fontSize: largeFontSize,
    padding: narrowSpace,
  },
  fontSizes: {
    extraLarge: extraLargeFontSize,
    large: largeFontSize,
    medium: mediumFontSize,
    normal: defaultFontSize,
  },
  list: {
    separatorHeight: 1,
    singleItem: {
      fontSize: mediumFontSize,
      margin: 0,
      padding: narrowSpace,
      paddingHorizontal: space,
      paddingVertical: narrowSpace,
    },
  },
  spacing: {
    narrow: narrowSpace,
    normal: space,
    size1: space,
    size2: space * 2,
    wide: wideSpace,
  },
};
