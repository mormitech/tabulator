export default function (input, floop) {

	// <mormi-table replace from>
	//var workbook2 = XLSX.read(input);
	//var sheet = workbook2.Sheets[workbook2.SheetNames[0]];
	//return XLSX.utils.sheet_to_json(sheet, {});	
	// <mormi-table replace to>
	XLSX = document.XLSX;

	var workbook2 = XLSX.read(input, {
		cellDates: true
	});
	var sheet = workbook2.Sheets[workbook2.SheetNames[0]];

	var response = XLSX.utils.sheet_to_json(sheet, {});

	return response;
	// </mormi-table replace>
}