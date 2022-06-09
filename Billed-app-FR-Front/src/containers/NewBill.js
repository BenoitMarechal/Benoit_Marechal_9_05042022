import { ROUTES_PATH } from '../constants/routes.js';
import Logout from './Logout.js';

export default class NewBill {
	constructor({ document, onNavigate, store, localStorage }) {
		this.document = document;
		this.onNavigate = onNavigate;
		this.store = store;
		const formNewBill = this.document.querySelector(
			`form[data-testid="form-new-bill"]`
		);
		formNewBill.addEventListener('submit', this.handleSubmit);
		const fileForm = this.document.querySelector(`input[data-testid="file"]`);
		fileForm.addEventListener('change', this.handleChangeFile);
		this.fileUrl = null;
		this.fileName = null;
		this.billId = null;
		new Logout({ document, localStorage, onNavigate });
	}
	//add a filter on file's extension
	handleChangeFile = (e) => {
		e.preventDefault();
		let submitBtn = document.getElementById('btn-send-bill');
		let file = this.document.querySelector(`input[data-testid="file"]`)
			.files[0];
		if (
			file !== undefined &&
			(file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/jpg')
		) {
			const filePath = e.target.value.split(/\\/g);
			console.log(filePath);
			submitBtn.style.display = 'inline-block';
			const fileName = filePath[filePath.length - 1];
			const formData = new FormData();
			const email = JSON.parse(localStorage.getItem('user')).email;
			formData.append('file', file);
			formData.append('email', email);
			console.log(document.querySelector('#btn-send-bill'));

			this.store
				.bills()
				.create({
					data: formData,
					headers: {
						noContentType: true,
					},
				})
				.then(({ fileUrl, key }) => {
					console.log(fileUrl);
					this.billId = key;
					this.fileUrl = fileUrl;
					this.fileName = fileName;
				})
				.catch((error) => console.error(error));
		} else {
			console.log('1');
			window.alert(
				'Unsupported file format'
				//+ file.name
			);
			submitBtn.style.display = 'none';
			file = null;
			window.location.reload(false);
		}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		console.log(e);
		console.log(
			'e.target.querySelector(`input[data-testid="datepicker"]`).value',
			e.target.querySelector(`input[data-testid="datepicker"]`).value
		);
		const email = JSON.parse(localStorage.getItem('user')).email;
		const bill = {
			email,
			type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
			name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
			amount: parseInt(
				e.target.querySelector(`input[data-testid="amount"]`).value
			),
			date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
			vat: e.target.querySelector(`input[data-testid="vat"]`).value,
			pct:
				parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
				20,
			commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
				.value,
			fileUrl: this.fileUrl,
			fileName: this.fileName,
			status: 'pending',
		};
		//this.updateBill(bill);//
		this.onNavigate(ROUTES_PATH['Bills']);
	};

	// not need to cover this function by tests
	/* istanbul ignore next */
	updateBill = (bill) => {
		console.log('update bill called');
		console.log(bill);
		if (this.store) {
			this.store
				.bills()
				.update({ data: JSON.stringify(bill), selector: this.billId })
				.then(() => {
					this.onNavigate(ROUTES_PATH['Bills']);
				})
				.catch((error) => console.error(error));
		}
	};
}

////////////////OLD

// import { ROUTES_PATH } from '../constants/routes.js';
// import Logout from './Logout.js';

// export default class NewBill {
// 	constructor({ document, onNavigate, store, localStorage }) {
// 		this.document = document;
// 		this.onNavigate = onNavigate;
// 		this.store = store;
// 		const formNewBill = this.document.querySelector(
// 			`form[data-testid="form-new-bill"]`
// 		);
// 		formNewBill.addEventListener('submit', this.handleSubmit);
// 		// const file = this.document.querySelector(`input[data-testid="file"]`);
// 		const file = this.document.querySelector(`input[data-testid="file"]`);

// 		file.addEventListener('change', this.handleChangeFile);
// 		//console.log(file);
// 		this.fileUrl = null;
// 		this.fileName = null;
// 		this.billId = null;
// 		new Logout({ document, localStorage, onNavigate });
// 	}

// 	//add a filter on file's extension
// 	handleChangeFile = (e) => {
// 		let submitBtn = document.getElementById('btn-send-bill');
// 		e.preventDefault();
// 		let file = this.document.querySelector(`input[data-testid="file"]`)
// 			.files[0];
// 		console.log(file);

// 		if (
// 			file !== undefined &&
// 			(file.type === 'image/jpeg' ||
// 				file.type === 'image/png' ||
// 				file.type === 'image/jpg')
// 		) {
// 			submitBtn.style.display = 'inline-block';
// 			const filePath = e.target.value.split(/\\/g);
// 			console.log(filePath);
// 			const fileName = filePath[filePath.length - 1];
// 			console.log(fileName);
// 			//isolating file's extension
// 			const extension = fileName.split('.')[fileName.split('.').length - 1];
// 			console.log(extension);
// 			const formData = new FormData();
// 			const email = JSON.parse(localStorage.getItem('user')).email;
// 			formData.append('file', file);
// 			formData.append('email', email);
// 			this.store
// 				.bills()
// 				.create({
// 					data: formData,
// 					headers: {
// 						noContentType: true,
// 					},
// 				})
// 				.then(({ fileUrl, key }) => {
// 					console.log(fileUrl);
// 					this.billId = key;
// 					this.fileUrl = fileUrl;
// 					this.fileName = fileName;
// 				})
// 				.catch((error) => console.error(error));
// 		} else {
// 			window.alert('Unsupported file format');
// 			submitBtn.style.display = 'none';
// 			file = null;
// 			//window.location.reload(false);
// 		}
// 	};

// 	handleSubmit = (e) => {
// 		e.preventDefault();
// 		console.log(
// 			'e.target.querySelector(`input[data-testid="datepicker"]`).value',
// 			e.target.querySelector(`input[data-testid="datepicker"]`).value
// 		);
// 		console.log(this);
// 		const email = JSON.parse(localStorage.getItem('user')).email;
// 		const bill = {
// 			email,
// 			type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
// 			name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
// 			amount: parseInt(
// 				e.target.querySelector(`input[data-testid="amount"]`).value
// 			),
// 			date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
// 			vat: e.target.querySelector(`input[data-testid="vat"]`).value,
// 			pct:
// 				parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
// 				20,
// 			commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
// 				.value,
// 			fileUrl: this.fileUrl,
// 			fileName: this.fileName,
// 			status: 'pending',
// 		};
// 		this.updateBill(bill);
// 		this.onNavigate(ROUTES_PATH['Bills']);
// 	};

// 	// not need to cover this function by tests
//   /* istanbul ignore next */
// 	updateBill = (bill) => {
// 		if (this.store) {
// 			this.store
// 				.bills()
// 				.update({ data: JSON.stringify(bill), selector: this.billId })
// 				.then(() => {
// 					this.onNavigate(ROUTES_PATH['Bills']);
// 				})
// 				.catch((error) => console.error(error));
// 		}
// 	};
// }
