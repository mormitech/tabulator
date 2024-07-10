export default function (input, floop) {

	XLSX = document.XLSX;

	var workbook2 = XLSX.read(input);
	var sheet = workbook2.Sheets[workbook2.SheetNames[0]];




	var response = XLSX.utils.sheet_to_json(sheet, {});



	return response;
}