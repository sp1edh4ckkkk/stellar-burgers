import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useSelector, useDispatch } from '../../services/store';
import { getUserState, getOrdersAll } from '../../services/userSlice/slice';
import { getFeeds } from '../../services/feedSlice/slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { userOrders, request } = useSelector(getUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersAll());
    dispatch(getFeeds());
  }, []);

  if (request === true) return <Preloader />;

  return <ProfileOrdersUI orders={userOrders} />;
};
