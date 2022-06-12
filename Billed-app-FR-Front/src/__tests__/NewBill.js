/*
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';
import NewBill from '../containers/NewBill.js';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../app/Router.js';
import store from '../__mocks__/store.js';
import mockedBills from '../__mocks__/store.js';

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
		});
	});
});

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
			document.body.innerHTML = '';
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			root.append(NewBillUI());
			document.body.append(root);

			router();

			window.onNavigate(ROUTES_PATH.NewBill);

			await waitFor(() => screen.getByTestId('icon-mail'));
			const mailIcon = screen.getByTestId('icon-mail');
			expect(mailIcon).toHaveClass('active-icon');
		});
	});
});

describe('When I am filling up a new bill', () => {
	describe('If I upload a file that is an image', () => {
		test('Then the submit button should appear', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ data: store, pathname });
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
			expect(handleChangeFile).toHaveBeenCalled();
			const submitButton = document.getElementById('btn-send-bill');
			expect(alert).not.toHaveBeenCalled();
			expect(submitButton.style.display).toBe('inline-block');
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
			expect(handleChangeFile).toHaveBeenCalled();
			const submitButton = document.getElementById('btn-send-bill');
			expect(alert).toHaveBeenCalled();
			expect(submitButton.style.display).toBe('none');
		});
	});
});

describe('After I have filled up the form correctly', () => {
	describe('When I click on submit', () => {
		test('Then a bill is created', async () => {
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({
					data: store,
					pathname,
					loading: false,
					error: null,
				});
			};
			const newBill = new NewBill({
				document,
				onNavigate,
				store: mockedBills,
				localStorage,
			});
			const submitButton = document.querySelector('#btn-send-bill');
			expect(submitButton).toBeDefined();
			const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
			expect(handleSubmit).toBeDefined();
			const form = document.querySelector('form');
			form.addEventListener('submit', handleSubmit);
			expect(form).toBeDefined();
			fireEvent.click(submitButton);
			expect(handleSubmit).toHaveBeenCalled();
		});
	});
});
