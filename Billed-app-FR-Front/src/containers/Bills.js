import { ROUTES_PATH } from '../constants/routes.js';
import { formatDate, formatStatus } from '../app/format.js';
import Logout from './Logout.js';

export default class {
	constructor({ document, onNavigate, store, localStorage }) {
		//	console.log('building new Bills class');
		//	console.log(onNavigate);
		//	console.log(store);
		//	console.log(localStorage);
		this.document = document;
		this.onNavigate = onNavigate;
		this.store = store;
		const buttonNewBill = document.querySelector(
			`button[data-testid="btn-new-bill"]`
		);
		/* istanbul ignore else */
		if (buttonNewBill)
			buttonNewBill.addEventListener('click', this.handleClickNewBill);
		const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
		/* istanbul ignore else */
		if (iconEye)
			iconEye.forEach((icon) => {
				icon.addEventListener('click', () => this.handleClickIconEye(icon));
			});
		new Logout({ document, localStorage, onNavigate });
	}

	handleClickNewBill = () => {
		//	console.log('log');
		this.onNavigate(ROUTES_PATH['NewBill']);
	};

	displayModal() {
		$(document).ready(function () {
			/* istanbul ignore next */
			$('#modaleFile').modal('show');
		});
	}

	handleClickIconEye = (icon) => {
		const billUrl = icon.getAttribute('data-bill-url');
		const imgWidth = Math.floor($('#modaleFile').width() * 0.5);
		$('#modaleFile')
			.find('.modal-body')
			.html(
				`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
			);
		//	console.log('handle click on eye Bills');
		this.displayModal();
		//old
		//initial modal openning line
		//$('#modaleFile').modal('show');
		//end old
		//new:
		// $(document).ready(function () {
		// 	$('#modaleFile').modal('show');
		// });

		//end new
	};

	///adding download function
	// handleClickIconDownload = (icon) => {
	// 	const billUrl = icon.getAttribute('data-bill-url');
	// };

	getBills = () => {
		//console.log('getBills was called');
		if (this.store) {
			return this.store
				.bills()
				.list()
				.then((snapshot) => {
					const bills = snapshot.map((doc) => {
						try {
							return {
								...doc,

								date: formatDate(doc.date),
								status: formatStatus(doc.status),
							};
						} catch (e) {
							// if for some reason, corrupted data was introduced, we manage here failing formatDate function
							// log the error and return unformatted date in that case
							console.log(e, 'for', doc);
							return {
								...doc,
								date: doc.date,
								status: formatStatus(doc.status),
							};
						}
					});
					//	console.log('length', bills.length);
					// console.log(bills);
					// //trier ici
					// bills.sort(function (a, b) {
					// 	return b.date.localeCompare(a.date);
					// });
					// bills.forEach((bill) => {
					// 	let formatedDate = formatDate(bill.date);
					// 	bill.date = formatedDate;
					// });

					// console.log(bills);
					// console.log(this.store);
					//console.log(bills);
					return bills;
				});
		}
	};
}
