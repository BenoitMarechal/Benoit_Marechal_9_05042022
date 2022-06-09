export const formatDate = (dateStr) => {
	//console.log(dateStr);
	const date = new Date(dateStr);
	const ye = new Intl.DateTimeFormat('eng', { year: 'numeric' }).format(date);
	const mo = new Intl.DateTimeFormat('eng', { month: 'short' }).format(date);
	const da = new Intl.DateTimeFormat('eng', { day: '2-digit' }).format(date);
	const month = mo.charAt(0).toUpperCase() + mo.slice(1);
	return `${parseInt(da)} ${month.substr(0, 3)}. ${ye.toString().substr(2, 4)}`;
	//passage en anglais pour éviter la confusion entre Juin et Juillet
};

const frenchMonths = [
	'Janv.',
	'Févr.',
	'Mars',
	'Avr.',
	'Mai',
	'Juin',
	'Juil.',
	'Août',
	'Sept.',
	'Oct.',
	'Nov.',
	'Déc.',
];

export const FRDateToDate = (date) => {
	let dd = date.split(' ')[0];
	let mm = frenchMonths.indexOf(date.split(' ')[1]);
	let yy = parseInt(date.split(' ')[2]) + 2000;
	let engDate = new Date(yy, mm, dd);

	// console.log(mm.toLocaleString('fr', { month: 'short' }));
	//console.log(yy);
	// console.log(date);
	//console.log(engDate);
	return engDate;
};

export const formatStatus = (status) => {
	switch (status) {
		case 'pending':
			return 'En attente';
		case 'accepted':
			return 'Accepté';
		case 'refused':
			return 'Refused';
	}
};
