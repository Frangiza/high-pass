import { validateForms } from '../functions/validate-forms';

const rules = [
  {
    ruleSelector: '.contacts__input-name',
    rules: [
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Недостаточное количество знаков'
      },
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните имя!'
      },
      {
        rule: 'customRegexp',
        value: /[a-z]/gi,
        errorMessage: 'Недопустимый формат'
      }
    ]
  },
  {
    ruleSelector: '.contacts__input-mail',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните Email'
      },
      {
        rule: 'email',
        value: true,
        errorMessage: 'Введите корректный Email'
      }
    ]
  },  
];

const afterForm = () => {
  console.log('Произошла отправка, тут можно писать любые действия');
};

validateForms('.contacts__form', rules, afterForm);
