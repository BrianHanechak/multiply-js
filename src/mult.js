function toggle(item) {
	var r = parseInt(item.attr("row"));
	var c = parseInt(item.attr("col"));
	if (item.hasClass("pressed")) {
		item.removeClass("pressed");
		item.addClass("unpressed");
		item.text(r.toString() + " X " + c.toString());
	} 
	else {
		item.addClass("pressed");
		item.removeClass("unpressed");
		item.text((r * c).toString());
	}
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
			col.attr("row", rowVal.toString());
			col.attr("col", colVal.toString());
			col.addClass("unpressed");
			col.addClass("noselect");
			col.text(rowVal.toString() + " X " + colVal.toString());
			col.click(function() { toggle($(this)); });
			col.text(rowVal.toString() + " X " + colVal.toString());
			row.append(col);
		}
		table.append(row);
	}
	$("body").append(table);
})