/// <reference path="../typings/jquery/jquery.d.ts"/>
/* ****************************************************
 * Size of table
 * Only square tables allowed with this architecture. 
 * ****************************************************/
var size = 9;


/** Toggle Button **/
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
	validateChallenge();
}

function toggleRow(item) {
	var r = parseInt(item.attr("row"));
	var allPressed = true;
	for (var x = 1; x <= size; x++) {
		if (!$("#C" + r + "_" + x).hasClass("pressed")) {
			allPressed = false;
		}
	}
	var shouldPress = !allPressed;
	for (var x = 1; x <= size; x++) {
		if (shouldPress != $("#C" + r + "_" + x).hasClass("pressed")) {
			toggle($("#C" + r + "_" + x));
		}
	}
}

function toggleCol(item) {
	var c = parseInt(item.attr("col"));
	var allPressed = true;
	for (var x = 1; x <= size; x++) {
		if (!$("#C" + x + "_" + c).hasClass("pressed")) {
			allPressed = false;
		}
	}
	var shouldPress = !allPressed;
	for (var x = 1; x <= size; x++) {
		if (shouldPress != $("#C" + x + "_" + c).hasClass("pressed")) {
			toggle($("#C" + x + "_" + c));
		}
	}
}

var currentChallenge = null;

function clear() {
	for (var x = 1; x <= size; x++) {
		for (var y = 1; y <= size; y++) {
			$("#C" + x.toString() + "_" + y.toString()).removeClass("pressed").addClass("unpressed").text(x.toString() + " X " + y.toString());
		}
	}

	$(".challengeCell").text("Exploration mode").removeClass("success").removeClass("challenge1").removeClass("challenge2").removeClass("challenge3");
	currentChallenge = null;
}

/* validiateChallenge only works for "Find all" type challenges */
function validateChallenge() {
	if (currentChallenge != null) {
		var allGood = true;
		for (var x = 1; x <= size; x++) {
			for (var y = 1; y <= size; y++) {
				var pressed = $("#C" + x.toString() + "_" + y.toString()).hasClass("pressed");
				if (currentChallenge.validation(x, y) != pressed) {
					allGood = false;
				}
			}
		}
		if (allGood) {
			$(".challengeCell").text("Challenge succeeded! " + currentChallenge.text).addClass("success");
		} 
		else {
			$(".challengeCell").text("Current challenge: " + currentChallenge.text).removeClass("success");
		}
	}
}

function numberToDigits(num) {
	var digits = []; 
	while (num > 0) { 
		digits.push(num%10); 
		num = Math.floor(num/10); 
	} 
	digits.reverse();
	return digits;
}

var challenges = [
	[
		{
			"text": "Find all even numbers",
			"validation": function(x, y) { return (x*y)%2==0; }
		},
		{
			"text": "Find all multiples of 3",
			"validation": function(x, y) { return (x*y)%3==0; }
		},
		{
			"text": "Find all of the number 24",
			"validation": function(x, y) { return x*y == 24; }
		}
	],
	[
		{
			"text": "Find all multiples of 6",
			"validation": function(x, y) { return (x*y)%6==0; }
		},
		{
			"text": "Find all multiples of 10",
			"validation": function(x, y) { return (x*y)%10==0; }
		},
		{
			"text": "Find all the 2-digit numbers",
			"validation": function(x, y) { var p = x * y; return p >= 10 && p < 100; }
		},
		{
			"text": "Find all the numbers bigger than 47",
			"validation": function(x, y) { var p = x * y; return p > 47; }
		},
		{
			"text": "Find all the numbers between 30 and 39, inclusive",
			"validation": function(x, y) { var p = x * y; return (p >= 30 && p < 40); }
		}
	],
	[
		{
			"text": "Find all the odd numbers",
			"validation": function(x, y) { return (x*y)%2==1; }
		},
		{
			"text": "Find all the powers of 2",
			"validation": function(x, y) { var k = 1; var p = x * y; while (true) { if (k == p) return true; if (k > p) return false; k *= 2; } } 
		},
		{
			"text": "Find all the numbers with the digit '1'",
			"validation": function(x, y) { var p = x * y; while (p > 0) { if (p%10 == 1) return true; p = Math.floor(p/10); } return false; }
		},
		{
			"text": "Find all the numbers with the digit '5'",
			"validation": function(x, y) { var p = x * y; while (p > 0) { if (p%10 == 5) return true; p = Math.floor(p/10); } return false; }
		},
		{
			"text": "Find all the numbers with a ones digit of '1' or '9'",
			"validation": function(x, y) { var p = x * y; return (p%10 == 1 || p%10 == 9)}
		},
		{
			"text": "Find all the numbers with the same digit more than once",
			"validation": function(x, y) { 
				var p = x * y; 
				var digits = numberToDigits(p);
				for (var a = 0; a < digits.length; a++) { 
					for (var b = 0; b < digits.length; b++) { 
						if (a != b && digits[a] == digits[b]) { 
							return true; 
						}
					}
				} return false; 
			}
		},
		{
			"text": "Find all the numbers with at least two digits, whose digits increase monotonically",
			"validation": function(x, y) { 
				var p = x * y; 
				var digits = numberToDigits(p);
				if (digits.length < 2) {
					return false;
				}
				var lastDigit = 0;
				for (var a = 0; a < digits.length; a++) {
					if (digits[a] < lastDigit) {
						return false;
					}
					lastDigit = digits[a];
				}
				return true;
			}
		}
		
	]
];

/* Callback for challenge button clicked */
function generateChallenge(difficulty) {
	clear();
	var challengeSet = challenges[difficulty];
	currentChallenge = challengeSet[Math.floor(Math.random()*challengeSet.length)];
	$(".challengeCell").addClass('challenge' + (difficulty+1).toString());
	validateChallenge();
}

/********************
 ** Initialization **
 ********************/
$(document).ready(function() {
	var table = $('<table></table>').addClass('mainTable');
	var colToggleRow = $('<tr></tr>').addClass('mainRow');
	var upperLeftCell = $('<td></td>');
	colToggleRow.append(upperLeftCell);
	
	/* Generate the column select buttons */
	for (var colNum = 0; colNum < size; colNum++) {
		var colToggle = $("<td></td>").addClass('toggle').addClass('colToggle');
		var colVal = colNum + 1;
		colToggle.attr("id", "COL" + colVal.toString());
		colToggle.attr("col", colVal.toString());
		colToggle.click(function() { toggleCol($(this)); });
		colToggleRow.append(colToggle);
	}
	table.append(colToggleRow);
	
	/* Generate the multiplication table and row selection buttons */
	for (var rowNum = 0; rowNum < size; rowNum++) {
		var row = $('<tr></tr>').addClass('mainRow');
		var rowVal = rowNum + 1;
		
		var rowToggle = $("<td></td>").addClass('toggle').addClass('rowToggle');
		rowToggle.attr("id", "ROW" + rowVal.toString());
		rowToggle.attr("row", rowVal.toString());
		rowToggle.click(function() { toggleRow($(this)); });
		row.append(rowToggle);
		
		for (var colNum = 0; colNum < size; colNum++) {
			var col = $('<td></td>').addClass('cell');
			var colVal = colNum + 1;
			col.attr("id", "C" + rowVal.toString() + "_" + colVal.toString())
			col.attr("row", rowVal.toString());
			col.attr("col", colVal.toString());
			col.addClass("unpressed");
			col.addClass("noselect");
			col.click(function() { toggle($(this)); });
			col.text(rowVal.toString() + " X " + colVal.toString());
			row.append(col);
		}
		table.append(row);
	}
	
	var challengeRow = $('<tr></tr>').addClass('challengeRow');
	challengeRow.append($('<td></td>'));
	var challengeCell = $('<td></td>').attr('colspan', size - 1).addClass('challengeCell').addClass('noselect');
	challengeCell.text("Exploration mode");
	challengeRow.append(challengeCell);
	var clearCell = $('<td></td>').addClass('noselect').addClass('button').addClass('clearButton');
	clearCell.text("Clear");
	clearCell.click(function() { clear(); } );
	challengeRow.append(clearCell);
	table.append(challengeRow);
	var challengeButtonRow = $('<tr></tr>').addClass('challengeButtonRow');
	challengeButtonRow.append($('<td></td>'));
	
	/** This is the code I want to make general */
	var buttonSize1 = Math.floor(size / 3);
	
	var challengeButtonCell1 = $('<td></td>').attr('colspan', buttonSize1).addClass('noselect').addClass('button').addClass('challengeButton').addClass('challenge1');
	challengeButtonCell1.text('Easy challenge');
	challengeButtonCell1.click(function() { generateChallenge(0); } );
	challengeButtonRow.append(challengeButtonCell1);
	
	var challengeButtonCell2 = $('<td></td>').attr('colspan', size - 2 * buttonSize1).addClass('noselect').addClass('button').addClass('challengeButton').addClass('challenge2');
	challengeButtonCell2.text('Medium challenge');
	challengeButtonCell2.click(function() { generateChallenge(1); } );
	challengeButtonRow.append(challengeButtonCell2);
	
	var challengeButtonCell3 = $('<td></td>').attr('colspan', buttonSize1).addClass('noselect').addClass('button').addClass('challengeButton').addClass('challenge3');
	challengeButtonCell3.text('Hard challenge');
	challengeButtonCell3.click(function() { generateChallenge(2); } );
	challengeButtonRow.append(challengeButtonCell3);
	table.append(challengeButtonRow);
	
	/* This is where we actually change the webpage. */
	$("body").append(table);
})