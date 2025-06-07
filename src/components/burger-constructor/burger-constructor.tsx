import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/constructorSlice/slice';
import { getUserState } from '../../services/userSlice/slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const { constructorItems, orderModalData, orderRequest } =
    useSelector(getConstructorState);
  const isAuthenticated = useSelector(getUserState).isAuthenticated;
  const dispatch = useDispatch();

  let arr: string[] = [];
  const ingredients: string[] | void = constructorItems.ingredients.map(
    (i) => i._id
  );

  if (constructorItems.bun) {
    const bun = constructorItems.bun?._id;
    arr = [bun, ...ingredients, bun];
  }

  const onOrderClick = () => {
    if (isAuthenticated && !constructorItems.bun) {
      dispatch(setRequest(true));
      dispatch(orderBurger(arr));
    }
    if (isAuthenticated && constructorItems.bun) return;
    if (!isAuthenticated) return navigate('/login');
  };
  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
