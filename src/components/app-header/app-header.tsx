import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { getUserState } from '../../services/userSlice/slice';

export const AppHeader: FC = () => {
  const data = useSelector(getUserState).userData;
  return <AppHeaderUI userName={data?.name ?? ''} />;
};
