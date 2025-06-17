import { Header, HeaderBackButton } from '@react-navigation/elements';
import React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ListRenderItem } from 'react-native';
import { FlatList, Modal, Platform, SafeAreaView, View } from 'react-native';

import { colors, dimensions } from '@/theme';

import Box from '../Box/Box';
import { ListItem } from '../ListItem/ListItem';
import { ListSeparator } from '../ListSeparator/ListSeparator';
import { SearchInput } from '../SearchInput/SearchInput';
import type { SelectItem, SelectItemValue } from './Select';

type SelectModalProps = {
  isShown: boolean;
  hasSearch: boolean;
  title: string;
  items: SelectItem[];
  selectedItem?: SelectItemValue;
  onSelect: (item: SelectItem) => void;
  onClose: () => void;
};

type SelectModalSearchBarProps = {
  isShown: boolean;
  query: string;
  onQuery: (query: string) => void;
};

const SelectModalSearchBar: React.FC<SelectModalSearchBarProps> = ({ isShown, query, onQuery }) => {
  const { t } = useTranslation();

  if (!isShown) {
    return null;
  }

  return (
    <>
      <Box backgroundColor={colors.list.even.background} px={dimensions.spacing.narrow} py={dimensions.spacing.normal}>
        <SearchInput
          placeholder={t('general.search_placeholder')}
          value={query}
          onChangeText={onQuery}
          onClear={() => onQuery('')}
          onSubmitEditing={(evt) => {
            onQuery(evt.nativeEvent.text);
          }}
        />
      </Box>
      <ListSeparator />
    </>
  );
};

export const SelectModal: React.FC<SelectModalProps> = ({
  isShown,
  hasSearch = false,
  title,
  items,
  selectedItem,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');

  const renderItem: ListRenderItem<SelectItem> = useCallback(
    ({ item, index }) => (
      <ListItem
        isChecked={item.value === selectedItem}
        isEven={hasSearch ? index % 2 !== 0 : index % 2 === 0}
        subTitle={item.subTitle}
        title={item.title}
        variant="checkbox"
        onPress={() => {
          setQuery('');
          onSelect(item);
        }}
      />
    ),
    [hasSearch, onSelect, selectedItem],
  );

  const filteredItems = useMemo(() => {
    if (query.trim().length === 0) {
      return items;
    }

    return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  const backImage = useCallback(() => {
    if (Platform.OS === 'ios') {
      return () => <Box px={10}></Box>;
    }

    return undefined;
  }, []);

  return (
    <Modal animationType="slide" presentationStyle="formSheet" visible={isShown} onRequestClose={onClose}>
      <SafeAreaView>
        <View style={{ overflow: 'visible', zIndex: 1 }}>
          <Header
            headerShadowVisible
            headerLeft={() => (
              <HeaderBackButton backImage={backImage()} label={t('general.button_cancel')} onPress={onClose} />
            )}
            title={title}
          />
        </View>
        <FlatList<SelectItem>
          data={filteredItems}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item) => item.value}
          ListHeaderComponent={<SelectModalSearchBar isShown={hasSearch} query={query} onQuery={setQuery} />}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </Modal>
  );
};
