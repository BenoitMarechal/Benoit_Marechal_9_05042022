import eyeBlueIcon from '../assets/svg/eye_blue.js';
import downloadBlueIcon from '../assets/svg/download_blue.js';

// export default (billUrl) => {
// 	return `<div class="icon-actions">
//       <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
//       ${eyeBlueIcon}
//       </div>

//       <div id="download" data-testid="download" data-bill-url=${billUrl}>
//       ${downloadBlueIcon}
//       </div>

//     </div>`;
// };

export default (billUrl) => {
	return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div> 
      ${
				billUrl === 'null'
					? ''
					: '<a href=' +
					  billUrl +
					  //'.jpg' + //Ouvrir avec la visionneuse
					  ' ><span id=icon-download-d data-testid=icon-download' +
					  '>' +
					  downloadBlueIcon +
					  '</span></a>'
			}
      
      

    </div>`;
};

// ${
//   bill.fileName === 'null'
//     ? ''
//     : '<a href=' +
//       bill.fileUrl +
//       //'.jpg' + //Ouvrir avec la visionneuse
//       ' ><span id=icon-download-d data-testid=icon-download' +
//       '>' +
//       download_white +
//       '</span></a>'
// }

{
	/* <div class='icons-container'>
              <span id="icon-eye-d" data-testid="icon-eye-d" data-bill-url="${
								bill.fileUrl
							}"> ${bill.fileName === 'null' ? '' : eyeWhite}
              </span>              
              ${
								bill.fileName === 'null'
									? ''
									: '<a href=' +
									  bill.fileUrl +
									  //'.jpg' + //Ouvrir avec la visionneuse
									  ' ><span id=icon-download-d data-testid=icon-download' +
									  '>' +
									  download_white +
									  '</span></a>'
							}
            </div> */
}

//deleting id to avoid multiple identical id's
//adding download icon
// export default (billUrl) => {
// 	return `<div class="icon-actions">
//       <div class="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
//       ${eyeBlueIcon}
//       </div>
//       <div class="download-blue" data-testid="icon-eye" data-bill-url=${billUrl}>
//       ${downloadBlueIcon}
//       </div>

//     </div>`;
// };
