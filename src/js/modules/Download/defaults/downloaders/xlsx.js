import CoreFeature from '../../../../core/CoreFeature.js';

export default function (list, options, setFileContents) {

	XLSX = document.XLSX;

	var self = this,
		sheetName = options.sheetName || "Sheet1",
		workbook = XLSX.utils.book_new(),
		tableFeatures = new CoreFeature(this),
		compression = 'compress' in options ? options.compress : true,
		writeOptions = options.writeOptions || { bookType: 'xlsx', bookSST: true, compression },
		output;

	//writeOptions.type = 'binary';
	writeOptions.type = 'base64';

	workbook.SheetNames = [];
	workbook.Sheets = {};

	function generateSheet() {
		var rows = [],
			merges = [],
			worksheet = {},
			range = { s: { c: 0, r: 0 }, e: { c: (list[0] ? list[0].columns.reduce((a, b) => a + (b && b.width ? b.width : 1), 0) : 0), r: list.length } };

		//parse row list
		list.forEach((row, i) => {
			var rowData = [];

			row.columns.forEach(function (col, j) {

				if (col) {

					var value = col.value;

					if (value && typeof value === "object" && value.isLuxonDateTime) {
						rowData.push(value.toJSDate());
					}
					else if (value === null || value === undefined || value === "") {
						rowData.push(null);
					}
					else {
						rowData.push(!(value instanceof Date) && typeof value === "object" ? JSON.stringify(value) : value);
					}

					if (col.width > 1 || col.height > -1) {
						if (col.height > 1 || col.width > 1) {
							merges.push({ s: { r: i, c: j }, e: { r: i + col.height - 1, c: j + col.width - 1 } });
						}
					}
				} else {
					rowData.push("");
				}
			});

			console.warn(rowData);

			rows.push(rowData);

		});



		//convert rows to worksheet
		XLSX.utils.sheet_add_aoa(worksheet, rows);

		worksheet['!ref'] = XLSX.utils.encode_range(range);

		if (merges.length) {
			worksheet["!merges"] = merges;
		}

		return worksheet;
	}

	if (options.sheetOnly) {
		setFileContents(generateSheet());
		return;
	}

	if (options.sheets) {
		for (var sheet in options.sheets) {

			if (options.sheets[sheet] === true) {
				workbook.SheetNames.push(sheet);
				workbook.Sheets[sheet] = generateSheet();
			} else {

				workbook.SheetNames.push(sheet);

				tableFeatures.commsSend(options.sheets[sheet], "download", "intercept", {
					type: "xlsx",
					options: { sheetOnly: true },
					active: self.active,
					intercept: function (data) {
						workbook.Sheets[sheet] = data;
					}
				});
			}
		}
	} else {
		workbook.SheetNames.push(sheetName);
		workbook.Sheets[sheetName] = generateSheet();
	}

	if (options.documentProcessing) {
		workbook = options.documentProcessing(workbook);
	}

	//convert workbook to binary array
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}

	output = XLSX.write(workbook, writeOptions);

	setFileContents(s2ab(output), "application/octet-stream");

	return output;
}
