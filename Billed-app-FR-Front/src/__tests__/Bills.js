/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import BillsUI from '../views/BillsUI.js';
import Bills from '../containers/Bills.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES, ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store';

import router from '../app/Router.js';
import store from '../__mocks__/store.js';
//a supprimer?

/////////////
import userEvent from '@testing-library/user-event';
import DashboardFormUI from '../views/DashboardFormUI.js';
import DashboardUI from '../views/DashboardUI.js';
import Dashboard, { filteredBills, cards } from '../containers/Dashboard.js';

///////////////

jest.mock('../app/store', () => mockStore);

describe('Given I am connected as an employee', () => {
	describe('When I am on Bills Page', () => {
		test('Then bill icon in vertical layout should be highlighted', async () => {
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
			document.body.append(root);
			//fonction qui vient remplir la div root avec un BillsUI
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await waitFor(() => screen.getByTestId('icon-window'));
			const windowIcon = screen.getByTestId('icon-window');
			//to-do write expect expression
			expect(windowIcon).toHaveClass('active-icon');
			//END to-do write expect expression
		});
		test('Then bills should be ordered from earliest to latest', () => {
			document.body.innerHTML = BillsUI({ data: bills });
			const dates = screen
				.getAllByText(
					/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
				)
				.map((a) => a.innerHTML);
			const antiChrono = (a, b) => (a === b ? 0 : a < b ? 1 : -1);
			const datesSorted = [...dates].sort(antiChrono);
			expect(dates).toEqual(datesSorted);
		});

		//new
		test('Modal should be hidden', () => {
			document.body.innerHTML = BillsUI({ data: bills });
			let modal = document.getElementById('modaleFile');
			expect(modal).toHaveAttribute('aria-hidden', 'true');
		});
		test('New Bill button should be available', () => {
			document.body.innerHTML = BillsUI({ data: bills });
			let newBillBtn = screen.getByTestId('btn-new-bill');
			expect(newBillBtn).toBeDefined();
		});

		test('A modal should open when I click on the eye Icon', () => {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			document.body.innerHTML = BillsUI({ data: bills });
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const store = null;
			const testBills = new Bills({
				document,
				onNavigate,
				store,
				bills,
				localStorage: window.localStorage,
			});
			const eye = screen.getAllByTestId('icon-eye')[0];
			const handleClickIconEye = jest.fn(testBills.handleClickIconEye(eye));
			eye.addEventListener('click', handleClickIconEye);
			fireEvent.click(eye);
			expect(handleClickIconEye).toHaveBeenCalled();
			expect(screen.getAllByText('Justificatif')).toBeTruthy();
			let modal = document.getElementById('modaleFile');
			expect(modal).toBeTruthy();
			expect(modal).toBeVisible();
			// expect(modal).toHaveClass('modal fade show');
		});

		test('I change page when I click on new bill', () => {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
			});
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					type: 'Employee',
				})
			);
			document.body.innerHTML = BillsUI({ data: bills });
			const onNavigate = (pathname) => {
				document.body.innerHTML = ROUTES({ pathname });
			};
			const store = null;
			const testBills = new Bills({
				document,
				onNavigate,
				store,
				bills,
				localStorage: window.localStorage,
			});
			let newBillBtn = screen.getByTestId('btn-new-bill');
			const handleClickNewBill = jest.fn(testBills.handleClickNewBill());
			newBillBtn.addEventListener('click', handleClickNewBill);
			fireEvent.click(newBillBtn);
			expect(handleClickNewBill).toHaveBeenCalled();
		});
	});
});

/////////////////////////
describe('Given I am a user connected as Employee', () => {
	describe('When I navigate to Bills', () => {
		test('fetches user"s bills', async () => {
			localStorage.setItem(
				'user',
				JSON.stringify({ type: 'Employee', email: 'a@a' })
			);
			const root = document.createElement('div');
			root.setAttribute('id', 'root');
			document.body.append(root);
			router();
			window.onNavigate(ROUTES_PATH.Bills);
			await waitFor(() => screen.getByText('Mes notes de frais'));
			const check = screen.getByText('Mes notes de frais');
			expect(check).toBeTruthy();
		});

		///////////////////////////////////////////////////////////////////////
		describe('When an error occurs on API', () => {
			beforeEach(() => {
				jest.spyOn(mockStore, 'bills');
				Object.defineProperty(window, 'localStorage', {
					value: localStorageMock,
				});
				window.localStorage.setItem(
					'user',
					JSON.stringify({
						type: 'Admin',
						email: 'a@a',
					})
				);
				const root = document.createElement('div');
				root.setAttribute('id', 'root');
				document.body.appendChild(root);
				router();
			});
			test('fetches bills from an API and fails with 404 message error', async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error('Erreur 404'));
						},
					};
				});
				window.onNavigate(ROUTES_PATH.Bills);
				await new Promise(process.nextTick);
				const message = await screen.getByText(/Erreur 404/);
				expect(message).toBeTruthy();
			});

			test('fetches messages from an API and fails with 500 message error', async () => {
				mockStore.bills.mockImplementationOnce(() => {
					return {
						list: () => {
							return Promise.reject(new Error('Erreur 500'));
						},
					};
				});

				window.onNavigate(ROUTES_PATH.Bills);
				await new Promise(process.nextTick);
				const message = await screen.getByText(/Erreur 500/);
				expect(message).toBeTruthy();
			});
		});
	});
});
///////////
