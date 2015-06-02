function toggle(item, rowVal, colVal) {
	if (item.hasClass("pressed")) {
		item.removeClass("pressed");
		item.text(rowVal.toString() + " X " + colVal.toString());
	} 
	else {
		item.addClass("pressed");
		item.text((rowVal * colVal).toString());
	}
}

function makeToggleFunction(rowVal, colVal) {
	return function(item) { toggle(item, rowVal, colVal); }
}

$(document).ready(function() {
	var size = 9;
	var table = $('<table></table>').addClass('mainTable');
	for (var rowNum = 0; rowNum < size; rowNum++) {
		var row = $('<tr></tr>').addClass('mainRow');
		var rowVal = rowNum + 1;
		for (var colNum = 0; colNum < size; colNum++) {
			var col = $('<td></td>').addClass('cell');
			var colVal = colNum + 1;
			col.attr("id", "C" + rowVal.toString() + "_" + colVal.toString())
			col.text(rowVal.toString() + " X " + colVal.toString());
			col.click(function() { makeToggleFunction(rowVal, colVal)($(this)); });
			col.text(rowVal.toString() + " X " + colVal.toString());
			row.append(col);
		}
		table.append(row);
	}
	$("body").append(table);
})