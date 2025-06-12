import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/userSlice/slice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getUserState).isAuthChecked;
  const isAuthenticated = useSelector(getUserState).isAuthenticated;
  const location = useLocation();

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (isAuthChecked) return <Preloader />;

  return <Outlet />;
};
