import { FC } from 'react';
import { Params, useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/ingredientSlice/slice';

export const IngredientDetails: FC = () => {
  const { ingredients } = useSelector(getIngredientState);
  const { id } = useParams<Params>();

  const ingredientData = ingredients.find((i) => {
    if (i._id === id) return i;
  });

  if (!ingredientData) return <Preloader />;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
