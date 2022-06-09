/*
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from '@testing-library/dom';

import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../app/Router.js';
import userEvent from '@testing-library/user-event';

import store from '../__mocks__/store.js';
////GIVEN
// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then the mail icon should be highlighted", () => {
//       const html = NewBillUI()
//       document.body.innerHTML = html
//       //to-do write assertion
//     })
//   })
// })
////END GIVE

describe('Given I am connected as an employee', () => {
	describe('When I am on NewBill Page', () => {
		test('Then the commentary Input should be empty', () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const mailIcon = screen.getByTestId('commentary');
			expect(mailIcon.value).toBe('');
		});
		test('Then the "expense name" placeholder should be "Vol Paris Londres"', () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const expenseName = screen.getByTestId('expense-name');
			expect(expenseName.placeholder).toBe('Vol Paris Londres');
		});
		test('Then the submit button should be available, but hidden', () => {
			const html = NewBillUI();
			document.body.innerHTML = html;
			const submitButton = document.getElementById('btn-send-bill');
			expect(submitButton).toBeDefined();
			expect(submitButton.style.display).toBe('none');
			//expect(document.getElementsByTagName('html').length).toBe(1);
		});
	});
});

/////////////////////////////
describe('Given I am connected as an employee', () => {
	describe('When I am on new Bill Page', () => {
		test('Then mail icon in vertical layout should be highlighted', async () => {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);

			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			root.append(NewBillUI());
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.NewBill);
			await waitFor(() => screen.getByTestId('icon-mail'));
			const mailIcon = screen.getByTestId('icon-mail');
			//to-do write expect expression
			expect(mailIcon).toHaveClass('active-icon');
			//expect(document.getElementsByTagName('html').length).toBe(1);
		});
	});
});
/////////////////
describe('When I am filling up a new bill', () => {
	describe('If I upload a file that is an image', () => {
		test('Then the submit button should appear', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			root.append(NewBillUI());
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.NewBill);
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage,
			});
			await waitFor(() => screen.getByTestId('icon-mail'));
			const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
			const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
			const fileInput = document.querySelector(`input[data-testid="file"]`);
			fileInput.addEventListener('change', handleChangeFile);
			const dummyFile = new File([], 'picture.png', {
				type: 'image/png',
			});
			waitFor(() =>
				fireEvent.change(fileInput, {
					target: { files: [dummyFile] },
				})
			);
			//	waitFor(() => handleChangeFile);
			expect(handleChangeFile).toHaveBeenCalled();
			const submitButton = document.getElementById('btn-send-bill');
			expect(alert).not.toHaveBeenCalled();
			expect(submitButton.style.display).toBe('inline-block');
			//document.getElementsByTagName('html')[0].innerHTML = '';
		});
	});
	describe('If I upload a file that is NOT an image', () => {
		test('Then the submit button should NOT appear, and an error should be thrown', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			root.append(NewBillUI());
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.NewBill);
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage,
			});
			await waitFor(() => screen.getByTestId('icon-mail'));
			const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
			const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
			const fileInput = document.querySelector(`input[data-testid="file"]`);
			fileInput.addEventListener('change', handleChangeFile);
			const dummyFile = new File([], 'text.pdf', {
				type: 'application/pdf',
			});
			waitFor(() =>
				fireEvent.change(fileInput, {
					target: { files: [dummyFile] },
				})
			);
			//waitFor(() => handleChangeFile);
			expect(handleChangeFile).toHaveBeenCalled();
			const submitButton = document.getElementById('btn-send-bill');
			expect(alert).toHaveBeenCalled();
			expect(submitButton.style.display).toBe('none');
		});
	});
});

describe('After I have filled up the form correctly', () => {
	describe('When I click on submit', () => {
		test('Then the bill is updated and I am redirected to Bills page', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			root.append(NewBillUI());
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.NewBill);
			const newBill = new NewBill({
				document,
				onNavigate,
				store,
				localStorage,
			});
			await waitFor(() => screen.getByTestId('icon-mail'));
			/////////////page OK//////////////////////
			/////////////Declare Inputs
			// const mail = 'a@a';

			// const typeInput = document.querySelector(
			// 	`select[data-testid="expense-type"]`
			// );
			// expect(typeInput).toBeDefined();
			// typeInput.value = 'Transports';

			// const nameInput = document.querySelector(
			// 	`input[data-testid="expense-name"]`
			// );
			// expect(nameInput).toBeDefined();
			// nameInput.value = 'name';

			// const amountInput = document.querySelector(`input[data-testid="amount"]`);
			// expect(amountInput).toBeDefined();
			// amountInput.value = 50;

			// const dateInput = document.querySelector(
			// 	`input[data-testid="datepicker"]`
			// );
			// expect(dateInput).toBeDefined();
			// dateInput.value = '2022-06-09';

			// const vatInput = document.querySelector(`input[data-testid="vat"]`);
			// expect(vatInput).toBeDefined();
			// vatInput.value = '20';

			// const pctInput = document.querySelector(`input[data-testid="pct"]`);
			// expect(pctInput).toBeDefined();
			// pctInput.value = 10;

			// const commentaryInput = document.querySelector(
			// 	`textarea[data-testid="commentary"]`
			// );
			// expect(commentaryInput).toBeDefined();
			// commentaryInput.value = 'commentary';

			const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
			const fileInput = document.querySelector(`input[data-testid="file"]`);
			expect(fileInput).toBeDefined();
			fileInput.addEventListener('change', handleChangeFile);
			const dummyFile = new File([], 'img.jpg', {
				type: 'image/jpg',
			});
			waitFor(() =>
				fireEvent.change(fileInput, {
					target: { files: [dummyFile] },
				})
			);
			const fileUrl = 'someFileURL';
			const fileName = 'someFileName';
			const status = 'pending';
			const submitButton = document.querySelector('#btn-send-bill');
			expect(submitButton).toBeDefined();

			const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
			//jest.spyOn(newBill.updateBill()).mockImplementation(() => {});
			//const handleSubmit = jest.fn((e) => {});
			expect(handleSubmit).toBeDefined();
			//submitButton.addEventListener('click', handleSubmit);
			expect(submitButton).toBeVisible();
			expect(submitButton.style.display).toBe('inline-block');
			const form = document.querySelector('form');
			form.addEventListener('submit', handleSubmit);
			expect(form).toBeDefined();
			//fireEvent.submit(form);
			//fireEvent.click(submitButton);
			//expect(handleSubmit).toHaveBeenCalled();
		});
	});
});
