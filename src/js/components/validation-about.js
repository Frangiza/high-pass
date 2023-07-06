import { validateForms } from '../functions/validate-forms';

const rules = [
  {
    ruleSelector: '.about__form-input',
    rules: [
      {
        rule: 'required',
        value: true,
        errorMessage: 'Заполните Email'
      },
      {
        rule: 'email',
        value: true,
        errorMessage: 'Недопустимый формат'
      }
    ]
  },
];

const afterForm = () => {
  console.log('Произошла отправка, тут можно писать любые действия');
};

validateForms('.about__form', rules, afterForm);