var boardSize = 0;
var board;
var table = "";
var mines = 0;
var openedAmount = 1;
var openedCells = new Array();
var gameOver = false;
var size = checkBoardSize();
var username = "";

// Main function.
function main() {
	if (checkValidValues(mineCount(), checkBoardSize())) {
		startGame();
		clickCell();
	}
}

// Gets player's chosen mine amount.
function mineCount() {
	var mines = document.getElementById('mines').value;
	return mines;
}

// Gets player's chosen board size.
function checkBoardSize() {
	var radios = document.getElementsByName('boardSize');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
}

// Validates chosen mine amount and board size.
// Returns true if values are good.
function checkValidValues(mines, boardSize) {
	var correct = false;
	if (mines >= boardSize * boardSize) {
		alert("Too many bombs for this board size.");
	} else if (mines < 1) {
		alert("Mine count too small.");
	} else if (mines % 1 !== 0) {
		alert("Mine count must be a whole number." + table);
	} else {
		correct = true;
	}
	return correct;
}

// Generates the whole table with given amount of cells.
function generateTable(boardSize) {
	openedCells = new Array();
	mineLocation = new Array();
	var table = "";
	for (var row = 0; row < boardSize; row++) {
		table += "<tr>";
		for (var column = 0; column < boardSize; column++) {
			table += "<td id=" + formatId(column, row).substring(1) +
				" class='cells' " + "></td>";
		}
		table += "</tr>";
	}
	document.getElementById('minesweeper').innerHTML = table;
}

// Sets variables for a new game and generates the board.
// This is only used for a brand new game.
function startGame() {
	table = document.getElementById('minesweeper');
	restartGame();
	username = document.getElementById("username").value;
	boardSize = checkBoardSize();
	mines = mineCount();
	board = makeBoard(boardSize, mines);
	generateTable(boardSize);
	document.addEventListener("contextmenu", function (e) {
		e.preventDefault();
	}, false);
}

// Checks if a player has opened all possible cells without losing.
function checkWin() {
	boardSize = checkBoardSize();
	var toprow = document.getElementById('toprow');
	if (openedAmount == boardSize*boardSize) {
		toprow.rows[0].cells[0].innerHTML =
			"<img src='img/happy.gif' width='28' height='28' </img>";
		writeScoreboard("won", openedAmount, checkBoardSize());
		gameOver = true;
		return;
	}
}

// Sets variables back to beginning after a game ends.
function restartGame(){
	openedAmount = 1;
	gameOver = false;
	var toprow = document.getElementById('toprow');
	toprow.rows[0].cells[0].innerHTML =
		"<img src='img/bored.gif' width='28' height='28' </img>";
}

// Generates array for a board with given size and bomb amount.
function makeBoard(size, bombs) {
	var board = [];
	// initialize board, filling with zeros
	for (var x = 0; x < size; x++) {
		board[x] = []; // insert empty subarray
		for (var y = 0; y < size; y++) {
			board[x][y] = 0;
		}
	}
	// now fill board with bombs in random positions
	var i = bombs;
	while (i > 0) {
		// generate random x and y in range 0...size-1
		x = Math.floor(Math.random() * size);
		y = Math.floor(Math.random() * size);
		// put bomb on x,y unless there is a bomb already
		if (board[x][y] != 1) {
			board[x][y] = 1;
			i--; // bomb successfully positioned, one less to go
			// console.log("positioned mine at [" + x + "], [" + y + "], yet to go " + i);
		}
	}
  return board;
}

// Handles what happens when a player clicks a cell.
// When a cell is clicked, all data about current game will be saved.
function clickCell() {
	$(function() {
		$('.cells').click(function() {
		   var id = this.id;
		   var idFormatted = formatId(id.substring(0, 2), id.substring(2, 4));
		   var x = parseInt(id.substring(0, 2));
		   var y = parseInt(id.substring(2, 4));

		   if (this.opened || $.inArray(idFormatted, openedCells) > -1 ||
	   			gameOver) return;
			// changes cell state
		   this.opened = true;
		   openedAmount++;
		   $(this).css('backgroundColor', '#BBBBBB');

		   checkWin();
		   openedCells.push(formatId(id.substring(0, 2), id.substring(2, 4)));

		   // checks loss
		   if (board[x][y] == 1) {
			   $(this).css('backgroundColor', '#FF0000');
			   gameOver = true;
			   toprow.rows[0].cells[0].innerHTML =
			   		"<img src='img/sad.gif' width='28' height='28' </img>";
			   writeScoreboard("lost", openedAmount, checkBoardSize());
			//    return;
		   }

		   var neighbors = getNeighbours(boardSize, parseInt(x), parseInt(y));
		   var nearbyCount = 0;

		   // shows nearby mines
		   for (var i = 0; i < neighbors.length; i++) {
			   var table = document.getElementById('minesweeper');
			   if (board[neighbors[i][0]][neighbors[i][1]] == 1) {
				   nearbyCount++;
				   $("#" + x + y).html("");
				   table.rows[y].cells[x].innerHTML = "1";
			   }
			   if (i == neighbors.length - 1 && nearbyCount > 0) {
				   table.rows[y].cells[x].innerHTML = nearbyCount;
			   }
			   //this can open all neighbouring cells, upto 3x3
			   //for (var j = 0; j < neighbors.length; j++) {
			   //  if (nearbyCount == 0 && i == neighbors.length - 1) {
	   		   //		var neighbourId = formatId(neighbors[j][0], neighbors[j][1]);
			   //		this.opened = true;
			   //		openedAmount++;
	   		   //		$(neighbourId).css('backgroundColor', '#BBBBBB');
	   		   //		openedCells.push(neighbourId);
	   		   //	}
			   //}
			}
			currentGameToJSON();
		});
	});
}

// Formats cell ID. For example:
// formatId(1, 0) gives "#0100".
function formatId(x, y) {
	x = parseInt(x);
	y = parseInt(y);
	if (x < 10 && x >= 0) x = "0" + x;
	if (y < 10 && y >= 0) y = "0" + y;
	return "#" + x + y;
}

// Returns a list of neighbour square coordinate pairs for a board
// with a given size. Examples:
// neighbours(10,4,4) gives [[3,3],[3,4],[3,5],[4,3],[4,5],[5,3],[5,4],[5,5]]
// neighbours(10,0,0) gives [[0,1],[1,0],[1,1]]
// neighbours(10,9,9) gives [[8,8],[8,9],[9,8]]
function getNeighbours(size, x, y) {
  var list = [];
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      // square is not a neighbour of itself
      if (i === 0 && j === 0) {
		  continue;
	  }
      // check whether the the neighbour is inside board bounds
      if ((x+i) >= 0 && (x+i) < size && (y+j) >= 0 && (y+j) < size) {
        list.push([x + i, y + j]);
      }
    }
  }
  return list;
}

function noContext() {
	return false;
}

// Loads previous game's metadata (board layout, mine amount,
// opened cell data etc). Player will be alerted if there's no ongoing game
// with his name.
function loadPreviousGame() {
	username = document.getElementById("username").value;
	var gameData = "";
	if (username === "") {
		username = "Unnamed player";
	}
	file = username + ".json";
	$(document).ready(function() {
        $.ajax({
            type:'GET',
            url:"./cgi-bin/minesweeper/loadPreviousGameState.py?name=" + username,
            contentType: "application/json",
            data: {},
        	success:function(data){
                console.log("Success! Previous game has been loaded.");
				boardSize = data["boardSize"];
				mines = data["mineCount"];
				openedAmount = data["openedAmount"];
				openedCells = data["openedCells"];
				board = data["board"];
				readBoard(username);
            },
            error: function(XMLHttpRequest,textStatus,errorThrown){
				alert("No game in progress for this player.");
                console.log("Error getting JSON: " + errorThrown);
            }
            });
    });
}

// Saves results into a text file after each loss/win.
function saveResults(gameresult, boardsize, opened) {
	opened = opened - 1;
	if (username === "") {
		username = "Unnamed player";
	}
	$.ajax({
		type: "POST",
		url: "./cgi-bin/minesweeper/writeResultToScoresFile.py?name=" + username + "&result=" + gameresult + "&moves=" + opened + "&boardSize=" + boardsize,
	});
}

// Reads results of previous games from a text file and
// sets scoreboard div to show them.
// This will be run on page load.
function readResults() {
	var resultData = "";
	$.ajax({
		type: "GET",
		url: "scores.txt",
		data: {},
		async: false,
		success: function (data) {
            $("#scoreboard").html(data);
			resultData = data;
        },
		error: function(XMLHttpRequest,textStatus,errorThrown){
			console.log("Error reading scores: " + errorThrown);
		}
	});
	return resultData;
}

// This writes current session's game results to a div
// and also saves the results to a text file.
function writeScoreboard(result, openedAmount, boardSize) {
	var row = document.getElementById("currentScoreboard");
  	if (openedAmount - 1 == 1) {
		row.innerHTML += "Unlucky! You opened a single cell of a " +
			boardSize + " by " + boardSize + " board and lost.<br>";
	} else {
		if (result == "won") {
			row.innerHTML += "You won! You opened " + (openedAmount - 1) +
				" cells of a " + boardSize  + "x" + boardSize + " board.<br>";
		} else if (result == "lost") {
			row.innerHTML += "You lost! You opened " + (openedAmount - 1) +
				" cells of a " + boardSize  + "x" + boardSize + " board.<br>";
		}
	}
	saveResults(result, boardSize, openedAmount);
}

// Writes current game board to text file.
// File will be emptied when player loses.
function writeBoardToFile(minesweeperBoard, username) {
	$.ajax({
		type: "POST",
		url: "./cgi-bin/minesweeper/writeGameBoardToFile.py",
		data: {
			username: username,
			boardText: minesweeperBoard
		},
		success: function(message){
        	console.log("Wrote board to file.");
		},
		error: function(XMLHttpRequest,textStatus,errorThrown){
			console.log("Error reading scores: " + errorThrown);
		}
	});
}

// Reads previous board file for player and loads the previous game if it exists.
function readBoard(username) {
	$.ajax({
		type: "GET",
		url: "savegames/" + username + "_board.txt",
		data: {},
		success: function (data) {
			console.log("Board has been loaded.");
			if (data == "") {
				alert("No game in progress for this player.");
			} else {
	            document.getElementById("minesweeper").innerHTML = data;
				clickCell();
			}
        },
		error: function(XMLHttpRequest,textStatus,errorThrown){
			console.log("Error reading board: " + errorThrown);
		}
	});
}

// Saves name and other metadata about game to json.
function currentGameToJSON() {
	minesweeperBoard = String(document.getElementById('minesweeper').innerHTML);
	if (gameOver) {
		minesweeperBoard = "";
	}
	writeBoardToFile(minesweeperBoard, username);
	$.ajax({
		type: "POST",
		url: "./cgi-bin/minesweeper/writeGameStateToFile.py",
		contentType: "application/json",
		data: JSON.stringify({
			"name": username,
			"mineCount": mineCount(),
			"boardSize": boardSize,
			"openedAmount": openedAmount,
			"openedCells": openedCells,
			"board": board
		})
	});
}

function filterHiscores() {
    var username = document.getElementById('username').value;
	var scoreboard = document.getElementById('scoreboard');
	$(function() {
		data = readResults();
		var lines = data.split("<br>").length - 1
		for (var i = 0; i < lines; i++) {
			if (i == 0) {
				scoreboard.innerHTML = "";
			}
			var list = data.split('<br>');
			if (list[i].includes(username + " ")) {
				scoreboard.innerHTML += list[i] + "<br>";
			}
		}
	});
}

// function checkUsername(username) {
// 	username = username.replace(/[^a-zA-Z ]/g, "");
// 	if (username === "") {
// 		username = "Unnamed player";
// 	}
// 	return username;
// }
