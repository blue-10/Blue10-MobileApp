import { useMemo } from 'react';
import { useGetAllUsers } from '@/hooks/queries/useGetAllUsers';
import { useGetSelectableUsers } from '@/hooks/queries/useGetSelectableUsers';
import { Select, type SelectProps } from '../Select/Select';
import { useGetCurrentUser } from '@/hooks/queries/useGetCurrentUser';

type Props = Omit<SelectProps, 'items'>;

export const SelectUser: React.FC<Props & { belongsTo?: string; replacingUserIds?: string[] }> = ({
  belongsTo,
  replacingUserIds,
  ...selectProps
}) => {
  const {
    data = [],
    query: { isPending },
  } = useGetAllUsers();
  const { data: selectableUserIds = [] } = useGetSelectableUsers();
  const { currentUser } = useGetCurrentUser();

  const listOfUserIds = useMemo(() => {
    return [currentUser!.Id, ...(belongsTo ? [belongsTo] : []), ...(currentUser?.ReplacingUserIds ?? [])];
  }, [currentUser, belongsTo]);

  const filteredUsers = useMemo(() => {
    return data.filter(
      (u) =>
        (selectableUserIds.map((i: string) => i.toLowerCase()).includes(u.id.toLowerCase()) && u.isSelectable) ||
        listOfUserIds.map((i: string) => i.toLowerCase()).includes(u.id.toLowerCase()),
    );
  }, [data, selectableUserIds, listOfUserIds]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (a.id === currentUser!.Id || b.id === currentUser!.Id) {
        return a.id === currentUser!.Id ? -1 : 1;
      } else if (a.id === belongsTo || b.id === belongsTo) {
        return a.id === belongsTo ? -1 : 1;
      } else if (replacingUserIds?.includes(a.id)) {
        return -1;
      } else if (replacingUserIds?.includes(b.id)) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [filteredUsers, currentUser!.Id, belongsTo, replacingUserIds]);

  const items = useMemo(() => {
    return sortedUsers.map((item) => ({
      title: item.name,
      value: item.id,
    }));
  }, [sortedUsers]);

  return <Select hasSearch isLoading={isPending} items={items} {...selectProps} />;
};
