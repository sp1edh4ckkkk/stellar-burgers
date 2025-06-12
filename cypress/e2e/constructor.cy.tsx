import Cypress from 'cypress';

const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ID_ANOTHER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const ID_FILLING = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;
const ID_SAUCE = `[data-cy=${'643d69a5c3f7b9001cfa0945'}]`;
const ID_MAIN = `[data-cy=${'643d69a5c3f7b9001cfa0946'}]`;

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orders.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get(`[data-cy='constructor']`, { timeout: 10000 }).as('constructor');
  cy.get('#modals').as('modal');
});

describe('Добавление ингредиента в список заказа.', () => {
  it('Увеличение счетчика ингредиента.', () => {
    cy.get(ID_FILLING).children('button').click();
    cy.get(ID_FILLING).find('.counter__num').contains('1');
    cy.get('@constructor').contains('Биокотлета из марсианской Магнолии').should('exist');
  });
  it('Увеличение счетчика соуса и основного ингредиента.', () => {
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(ID_SAUCE).find('.counter__num').contains('1');
    cy.get(ID_MAIN).find('.counter__num').contains('1');
    cy.get('@constructor').within(() => {
      cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
      cy.contains('Хрустящие минеральные кольца').should('exist');
    });
  });

  describe('Добавление булок и начинок.', () => {
    it('Добавление булки и начинки в список заказа.', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });
    it('Добавление булки после добавления начинки.', () => {
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });
    it('Добавление булки, соуса и основного ингредиента.', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
        cy.contains('Хрустящие минеральные кольца').should('exist');
      });
    });
  });

  describe('Замена булок.', () => {
    it('Замена булки другой, если список начинок пуст.', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
      });
    });
    it('Замена булки другой, если в списке есть начинка.', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });
    it('Замена булки при наличии в списке соуса и основного ингредиента.', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
        cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
        cy.contains('Хрустящие минеральные кольца').should('exist');
      });
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'ipsum');
    cy.setCookie('accessToken', 'lorem');
  });
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });

  it('Отправка заказа с последующей проверкой ответа.', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_FILLING).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('81125');
    cy.get('@constructor').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
    });
  });
  it('Отправка заказа, где в списке присутствует соус и основной ингредиент.', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('81125');
    cy.get('@constructor').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Соус с шипами Антарианского плоскоходца').should('not.exist');
      cy.contains('Хрустящие минеральные кольца').should('not.exist');
    });
  });
});

describe('Модальные окна.', () => {
  it('Открытие и проверка данных модального окна ингредиента.', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Биокотлета из марсианской Магнолии').should('exist');
  });
  it('Открытие модального окна соуса.', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_SAUCE).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Соус с шипами Антарианского плоскоходца').should('exist');
  });
  it('Открытие модального окна основного ингредиента.', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_MAIN).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Хрустящие минеральные кольца').should('exist');
  });
  it('Закрытие модального окна по клику на крестик.', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });
  it('Закрытие модального окна по клику на оверлей.', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('exist');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });
});