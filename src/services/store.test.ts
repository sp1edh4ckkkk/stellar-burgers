import store, { rootReducer } from '../services/store';

describe('Тестирование rootReducer', () => {
  test('Функция возвращает корректное начальное состояние хранилища', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(store.getState());
  });
});
