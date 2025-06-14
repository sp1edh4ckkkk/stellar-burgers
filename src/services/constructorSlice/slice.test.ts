import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './slice';
import { expect, test, describe } from '@jest/globals';

const firstBun = {
  id: 'default-bun',
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const secondBun = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const sauce = {
  id: 'sauce',
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
};

const firstIngredient = {
  id: 'firstIngredient',
  _id: '643d69a5c3f7b9001cfa0946',
  name: 'Хрустящие минеральные кольца',
  type: 'main',
  proteins: 808,
  fat: 689,
  carbohydrates: 609,
  calories: 986,
  price: 300,
  image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/mineral_rings-large.png'
};

const secondIngredient = {
  id: 'secondIngredient',
  _id: '643d69a5c3f7b9001cfa0947',
  name: 'Плоды Фалленианского дерева',
  type: 'main',
  proteins: 20,
  fat: 5,
  carbohydrates: 55,
  calories: 77,
  price: 874,
  image: 'https://code.s3.yandex.net/react/code/sp_1.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
};

describe('Тесты для редьюсера constructorSlice', () => {
  describe('Тестирование добавления ингредиентов', () => {
    test('Добавление ингредиента типа sauce в конструктор', () => {
      const newState = constructorSlice(initialState, addIngredient(sauce));
      const addedIngredient = newState.constructorItems.ingredients[0];
      expect(addedIngredient).toEqual({
        ...sauce,
        id: expect.any(String)
      });
    });
    test('Добавление булки в пустой конструктор', () => {
      const newState = constructorSlice(initialState, addIngredient(firstBun));
      const addedBun = newState.constructorItems.bun;
      expect(addedBun).toEqual({
        ...firstBun,
        id: expect.any(String)
      });
    });
    test('Замена существующей булки на новую', () => {
      const initialStateWithBun = {
        ...initialState,
        constructorItems: {
          bun: firstBun,
          ingredients: []
        }
      };
      const newState = constructorSlice(
        initialStateWithBun,
        addIngredient(secondBun)
      );
      const updatedBun = newState.constructorItems.bun;
      expect(updatedBun).not.toBeNull();
      expect(updatedBun).toEqual({
        ...secondBun,
        id: expect.any(String)
      });
      if (updatedBun) {
        expect(updatedBun.id).not.toBe(firstBun.id);
      }
    });
  });

  describe('Тестирование удаления ингредиентов', () => {
    const initialStateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [sauce]
      }
    };
    test('Удаление ингредиента по id', () => {
      const newState = constructorSlice(
        initialStateWithIngredients,
        removeIngredient(sauce.id)
      );
      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Тестирование перемещения ингредиентов', () => {
    const ingredients = [
      sauce,
      firstIngredient,
      secondIngredient
    ]

    const initialStateWithMultipleIngredients = {
      ...initialState,
      constructorItems: {
        bun: firstBun,
        ingredients: [...ingredients]
      }
    };

    test('Перемещение ингредиента вверх по списку', () => {
      const newState = constructorSlice(
        initialStateWithMultipleIngredients,
        moveIngredientUp(2)
      );
      expect(newState.constructorItems.ingredients[1].id).toBe(
        'secondIngredient'
      );
      expect(newState.constructorItems.ingredients[2].id).toBe(
        'firstIngredient'
      );
    });
    test('Перемещение ингредиента вниз по списку', () => {
      const newState = constructorSlice(
        initialStateWithMultipleIngredients,
        moveIngredientDown(1)
      );
      expect(newState.constructorItems.ingredients[1].id).toBe(
        'secondIngredient'
      );
      expect(newState.constructorItems.ingredients[2].id).toBe(
        'firstIngredient'
      );
    });
  });

  describe('Тестирование создания заказа', () => {
    const testActions = {
      pending: { type: orderBurger.pending.type, payload: null },
      rejected: {
        type: orderBurger.rejected.type,
        error: { message: 'Тестовая ошибка' }
      },
      fulfilled: {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 12345 } }
      }
    };

    test('Состояние загрузки при отправке заказа', () => {
      const state = constructorSlice(initialState, testActions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Обработка ошибки при создании заказа', () => {
      const state = constructorSlice(initialState, testActions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(testActions.rejected.error.message);
      expect(state.orderModalData).toBeNull();
    });
    test('Успешное создание заказа', () => {
      const state = constructorSlice(initialState, testActions.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderModalData?.number).toBe(
        testActions.fulfilled.payload.order.number
      );
    });
  });
});
