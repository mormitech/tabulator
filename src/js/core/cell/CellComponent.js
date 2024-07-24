//public cell object
export default class CellComponent {
	constructor(cell) {
		this._cell = cell;

		return new Proxy(this, {
			get: function (target, name, receiver) {
				if (typeof target[name] !== "undefined") {
					return target[name];
				} else {
					return target._cell.table.componentFunctionBinder.handle(
						"cell",
						target._cell,
						name
					);
				}
			},
		});
	}

	getValue() {
		return this._cell.getValue();
	}

	getOldValue() {
		return this._cell.getOldValue();
	}

	getInitialValue() {
		return this._cell.initialValue;
	}

	getElement() {
		return this._cell.getElement();
	}

	getRow() {
		return this._cell.row.getComponent();
	}

	getData(transform) {
		return this._cell.row.getData(transform);
	}
	getType() {
		return "cell";
	}
	getField() {
		return this._cell.column.getField();
	}

	getColumn() {
		return this._cell.column.getComponent();
	}

	setValue(value, mutate) {
		if (typeof mutate == "undefined") {
			mutate = true;
		}

		this._cell.setValue(value, mutate);
	}

	restoreOldValue() {
		this._cell.setValueActual(this._cell.getOldValue());
	}

	restoreInitialValue() {
		this._cell.setValue(this._cell.initialValue, false, false, true);
	}

	// <mormi-table add>
	setInitialValue(value) {
		this._cell.setInitialValue(value);
	}
	// </mormi-table add>

	checkHeight() {
		this._cell.checkHeight();
	}

	getTable() {
		return this._cell.table;
	}

	_getSelf() {
		return this._cell;
	}

	// <mormi-table add>
	update() {
		this._cell.update();
	}
	// </mormi-table add>
}
