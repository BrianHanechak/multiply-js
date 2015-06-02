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

var currentChallenge = null;
var size = 9;

function clear() {
	for (var x = 1; x <= size; x++) {
		for (var y = 1; y <= size; y++) {
			$("#C" + x.toString() + "_" + y.toString()).removeClass("pressed").addClass("unpressed").text(x.toString() + " X " + y.toString());
		}
	}

	$(".challengeCell").text("Exploration mode").removeClass("success").removeClass("challenge1").removeClass("challenge2").removeClass("challenge3");
}

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

function generateChallenge(difficulty) {
	var challengeSet = challenges[difficulty];
	currentChallenge = challengeSet[Math.floor(Math.random()*challengeSet.length)];
	clear();
	$(".challengeCell").addClass('challenge' + (difficulty+1).toString());
	validateChallenge();
}

$(document).ready(function() {
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
			col.click(function() { toggle($(this)); });
			col.text(rowVal.toString() + " X " + colVal.toString());
			row.append(col);
		}
		table.append(row);
	}
	var challengeRow = $('<tr></tr>').addClass('challengeRow');
	var challengeCell = $('<td></td>').attr('colspan', size - 1).addClass('challengeCell').addClass('noselect');
	challengeCell.text("Exploration mode");
	challengeRow.append(challengeCell);
	var clearCell = $('<td></td>').addClass('noselect').addClass('button').addClass('clearButton');
	clearCell.text("Clear");
	clearCell.click(function() { clear(); } );
	challengeRow.append(clearCell);
	table.append(challengeRow);
	var challengeButtonRow = $('<tr></tr>').addClass('challengeButtonRow');
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
	$("body").append(table);
})