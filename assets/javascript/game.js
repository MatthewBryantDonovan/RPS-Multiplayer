// all to be replaced by firebase
var p1Name = "";
var p1Choice = "";
var p1Wins = 0;
var p1Losses = 0;
var p2Name = "";
var p2Choice = "";
var p2Wins = 0;
var p2Losses = 0;
var ties = 0;
// might needed added to firebase as well
var specName = "";

$("#announcer").html("Enter the Arena!")

// if enter is pressed in the input field act as if it was submitted
var userInput = document.getElementById("player-name-entry");
userInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("player-name-entry-submit").click();
    }
});

function enterArena() { // add player to game or tell spectate
    var currentName = "";
    var p = "";

    if ($("#player-name-entry").val().trim() == "") {
        return;
    }

    if (p1Name == "") {
        p1Name = $("#player-name-entry").val().trim();
        currentName = p1Name;
        p = "Player 1";
        $("#p1-name").html(p1Name);
    } else if (p2Name == "") {
        p2Name = $("#player-name-entry").val().trim();
        currentName = p2Name;
        p = "Player 2";
        $("#p2-name").html(p2Name);
    } else {
        specName = $("#player-name-entry").val().trim();
        currentName = specName;
        p = "Spectator";
    }
    $("#player-name-entry").val("");

    console.log(currentName + " entered the arena as " + p);
    if (p1Name != "" && p2Name != "") {
        $("#announcer").html("Pick your choice!")
        //give p1 arena a border 
    }



}

function p1State() { //runs the screen printing for p1
    console.log("printed p1 screen");

    //TODO: need to learn about player state

}

function p2State() { //runs the screen printing for p2
    console.log("printed p2 screen");

    //TODO: need to learn about player states

}

function spectatorState() { //runs the screen printing for spectators
    console.log("printed spec screen");

    //TODO: need to learn about player states


}

function p1RPS() { //player1's turn to select
    if (p1Name == "" || p2Name == "") {
        return;
    }

    var p1Selected = $(event.target).attr("data");
    $("#p1-win").html("");
    $("#tie").html("");
    $("#p2-win").html("");



    p1Choice = p1Selected;
    $("#announcer").html("Waiting on " + p2Name + "!");

    console.log(p1Name + " selected " + p1Choice);
    if (p2Choice != "") {
        result();
    }
}

function p2RPS() { // player2's turn to select
    if (p1Name == "" || p2Name == "") {
        return;
    }
    var p2Selected = $(event.target).attr("data");

    p2Choice = p2Selected;
    $("#announcer").html("Waiting on " + p1Name + "!");

    console.log(p2Name + " selected " + p2Choice);
    if (p1Choice != "") {
        result();
    }
}



function result() {
    console.log("Computing Result");
    $("#announcer").html("Results are in!")


    if ((p1Choice === "Rock") || (p1Choice === "Paper") || (p1Choice === "Scissors")) {

        if ((p1Choice === "Rock" && p2Choice === "Scissors") ||
            (p1Choice === "Scissors" && p2Choice === "Paper") ||
            (p1Choice === "Paper" && p2Choice === "Rock")) {
            console.log(p1Name + " wins!");
            $("#p1-win").html(p1Name + " wins!");
            p1Wins++;
            $("#p1-wins").html("Wins: " + p1Wins);
            p2Losses++;
            $("#p2-losses").html("Losses: " + p2Losses);
        } else if (p1Choice === p2Choice) {
            console.log(p1Name + " and " + p2Name + " tie!");
            $("#tie").html(p1Name + " and " + p2Name + " tie!");
            ties++;
            $("#ties").html("Ties: " + ties);
        } else {
            console.log(p2Name + " wins!");
            $("#p2-win").html(p2Name + " wins!");
            p2Wins++;
            $("#p2-wins").html("Wins: " + p2Wins);
            p1Losses++;
            $("#p1-losses").html("Losses: " + p1Losses);
        }
    }

    p1Choice = "";
    p2Choice = "";
}

function nextShowdown() { // readies next showdown
    console.log("Next Showdown");

    //TODO: may not be needed

}

function playerDC() { // run this when player DC's
    console.log("Player Disconnected");

    //TODO: need to learn about player states


}

function keepP1() { // logic for when p1 disconnects
    console.log("Keeping Player 1 -- Removing Player 2");

    //TODO: need to learn about player states


}

function keepP2() { // logic for when p2 disconnects
    console.log("Keeping Player 2 -- Removing Player 1");

    //TODO: need to learn about player states


}

// if enter is pressed in the input field act as if it was submitted
var userInput = document.getElementById("chat-message");
userInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("chat-submit").click();
    }
});

function chat() { // logic for the chatbox
    if ($("#chat-message").val().trim() == "") {
        return;
    }

    var chatMessage = "[ " + p1Name + " ] - " + $("#chat-message").val().trim();
    $("#chat-message").val("");

    var currentChat = $("#chat-area").val().trim();

    if (currentChat == "") {
        $("#chat-area").html(chatMessage);
    } else {
        $("#chat-area").html(currentChat + "&#13" + chatMessage);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);

    }

    // TODO: need to add which player spoke
}


/* 
psudeocode
1) object for game includes
p1Name
p2Name
p1Choice
p2Choice
p1Wins
p2Wins
p1Losses
p2Losses
ties

2) methods
enterArena() {} // add player to game or tell spectate
p1State {} //runs the screen printing for p1
p2State {} //runs the screen printing for p2
spectatorState() {} //runs the screen printing for spectators
p1RPS() {} //player1's turn to select
p2RPS() {} // player2's turn to select
result() {} //who won? in this run the next method
nextShowdown(){} // readies next showdown
playerDC () {} // run this when player DC's
keepP1(){} // logic for when p1 disconnects
keepP2(){} // logic for when p2 disconnects
*/


/* # Unit 7 Assignment - Rock Paper Scissors (Challenge)

### Instructions
* Create a game that suits this user story:

  * Only two users can play at the same time.

  * Both players pick either `rock`, `paper` or `scissors`. 
  After the players make their selection, the game will tell them 
  whether a tie occurred or if one player defeated the other.

  * The game will track each player's wins and losses.

  * Throw some chat functionality in there! No online multiplayer game is complete without 
  having to endure endless taunts and insults from your jerk opponent.

  * Styling and theme are completely up to you. Get Creative!

  * Deploy your assignment to Github Pages.

### Create a README.md
* [About READMEs](https://help.github.com/articles/about-readmes/)
* [Mastering Markdown](https://guides.github.com/features/mastering-markdown/)
 */