  // Your web app's Firebase configuration
  var firebaseConfig = {
      apiKey: "AIzaSyBr2SU9eroV8YVTygOYW9lFn0t0qCw4oIM",
      authDomain: "rps-multiplayer-11a3d.firebaseapp.com",
      databaseURL: "https://rps-multiplayer-11a3d.firebaseio.com",
      projectId: "rps-multiplayer-11a3d",
      storageBucket: "rps-multiplayer-11a3d.appspot.com",
      messagingSenderId: "612449636794",
      appId: "1:612449636794:web:4d11fe6ba1cb3f668ecd83"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Create a variable to reference the database.
  var database = firebase.database();

  var p1Name = "";
  var p1Choice = "";
  var p1Wins = 0;
  var p1Losses = 0;
  var p1Access = false;
  var p2Name = "";
  var p2Choice = "";
  var p2Wins = 0;
  var p2Losses = 0;
  var p2Access = false;
  var isSpectating = false;
  var ties = 0;
  var arenaOpen = false;
  var specName = "";
  var whoAmI = ""; //player name
  var whatAmI = ""; // if they are player1[P1], player2[P2] or the spectator[Spectator]
  var chatMessage = "";
  var p1Exists = false;
  var p2Exists = false;
  var con2;

  $("#announcer").html("Two players needed to play!")

  // if enter -> "keyCode === 13" is pressed in the $("#player-name-entry") input field act as if it was submitted
  var userInput = document.getElementById("player-name-entry");
  userInput.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("player-name-entry-submit").click();
      }
  });

  function enterArena() { // add player to game or signify spectator
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
          p1Access = true;
          whatAmI = "P1";
          database.ref("/RPSp1").set({
              p1NameKey: p1Name,
          });
      } else if (p2Name == "") {
          p2Name = $("#player-name-entry").val().trim();
          currentName = p2Name;
          p = "Player 2";
          $("#p2-name").html(p2Name);
          p2Access = true;
          whatAmI = "P2";
          database.ref("/RPSp2").set({
              p2NameKey: p2Name,
          });
      } else {
          specName = $("#player-name-entry").val().trim();
          currentName = specName;
          p = "Spectator";
          isSpectating = true;
          whatAmI = "Spectator";
      }
      $("#player-name-entry").val("");

      if (p1Name != "" && p2Name != "" && arenaOpen == false) {
          /* $("#announcer").html("Pick your choice!") */ // I don't think I need this anymore
          arenaOpen = true;
      }
      /*  // might not need this anmore now that I am writing to database.ref("/RPSp2")
            database.ref("/RPSinfo").set({
                p1ChoiceKey: p1Choice,
                p2ChoiceKey: p2Choice,
                p1WinsKey: p1Wins,
                p1LossesKey: p1Losses,
                p2WinsKey: p2Wins,
                p2LossesKey: p2Losses,
                tiesKey: ties,
            }); */

      //Display what the user is
      $("#now-playing").empty()
      if (p1Access == true || p2Access == true) {
          $("#now-playing").append().html("<h1>You are playing as " + currentName + "</h1>")
      } else {
          $("#now-playing").append().html("<h1>You are spectating as " + currentName + "</h1>")
      }

      whoAmI = currentName;

      //going to try to make it so con2 = player positon

      if (whatAmI == "P1") {
          con2 = database.ref("/RPSp1").push(whoAmI);
      } else if (whatAmI == "P2") {
          con2 = database.ref("/RPSp2").push(whoAmI);
      } else {
        con2 = database.ref("/RPSspec").push(whoAmI);
      }
      console.log(con2);
      con2.onDisconnect().remove();
      return con2;

  }

  function p1RPS() { //player1's turn to select
      if (p1Name == "" || p2Name == "" || p1Access == false) {
          return;
      }

      var p1Selected = $(event.target).attr("data");
      $("#p1-win").html("");
      $("#tie").html("");
      $("#p2-win").html("");



      p1Choice = p1Selected;
      $("#announcer").html("Waiting on " + p2Name + "!");

      database.ref("/RPSinfo").set({
          p1ChoiceKey: p1Choice,
          p2ChoiceKey: p2Choice,
          p1WinsKey: p1Wins,
          p1LossesKey: p1Losses,
          p2WinsKey: p2Wins,
          p2LossesKey: p2Losses,
          tiesKey: ties,
      });

  }

  function p2RPS() { // player2's turn to select
      if (p1Name == "" || p2Name == "" || p2Access == false) {
          return;
      }
      var p2Selected = $(event.target).attr("data");

      p2Choice = p2Selected;
      $("#announcer").html("Waiting on " + p1Name + "!");

      database.ref("/RPSinfo").set({
          p1ChoiceKey: p1Choice,
          p2ChoiceKey: p2Choice,
          p1WinsKey: p1Wins,
          p1LossesKey: p1Losses,
          p2WinsKey: p2Wins,
          p2LossesKey: p2Losses,
          tiesKey: ties,
      });

  }



  function result() { // see who wins
      $("#announcer").html("Results are in!")


      if ((p1Choice === "Rock") || (p1Choice === "Paper") || (p1Choice === "Scissors")) {

          if ((p1Choice === "Rock" && p2Choice === "Scissors") ||
              (p1Choice === "Scissors" && p2Choice === "Paper") ||
              (p1Choice === "Paper" && p2Choice === "Rock")) {
              $("#p1-win").html(p1Name + " wins!");
              p1Wins++;
              $("#p1-wins").html("Wins: " + p1Wins);
              p2Losses++;
              $("#p2-losses").html("Losses: " + p2Losses);
          } else if (p1Choice === p2Choice) {
              $("#tie").html(p1Name + " and " + p2Name + " tie!");
              ties++;
              $("#ties").html("Ties: " + ties);
          } else {
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


  // if enter is pressed"keyCode === 13" in the $("#chat-message") input field act as if it was submitted
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
      if (whoAmI == "") {
          return;
      }

      chatMessage = "[ " + whoAmI + " ] - " + $("#chat-message").val().trim();
      $("#chat-message").val("");

      database.ref("/RPSchat").set({
          chatMessageKey: chatMessage,
          whoAmIKey: whoAmI,
      });



      var currentChat = $("#chat-area").val().trim();

      if (currentChat == "") {
          $("#chat-area").html(chatMessage);
      } else {
          $("#chat-area").html(currentChat + "&#13" + chatMessage);
          $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);

      }

  }


  // update users chat is used
  database.ref("RPSchat").on("value", function (snapshot) {
      chatMessage = snapshot.val().chatMessageKey;
      var whoSaidLast = snapshot.val().whoAmIKey;

      if (p1Access == true || p2Access == true || isSpectating == true) {
          if (whoSaidLast != whoAmI) {
              var currentChat = $("#chat-area").val().trim();

              if (currentChat == "") {
                  $("#chat-area").html(chatMessage);
              } else {
                  $("#chat-area").html(currentChat + "&#13" + chatMessage);
                  $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);

              }
          }
      }
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

  //update user when RPSp1 is updated
  database.ref("RPSp1").on("value", function (snapshot) {
      console.log("p1 trigger");

       if  (snapshot.numChildren() == 2 ) {
        p1Name = snapshot.val().p1NameKey;
       }else {
        p1Name = "";
        $("#announcer").html("Two players needed to play!")
        database.ref("/RPSinfo").set({
            p1ChoiceKey: "",
            p2ChoiceKey: "",
            p1WinsKey: 0,
            p1LossesKey: 0,
            p2WinsKey: 0,
            p2LossesKey: 0,
            tiesKey: 0,
        });
        $("#p1-wins").html("Wins: 0");
        $("#p1-losses").html("Losses: 0");
        $("#ties").html("Ties: 0");
        $("#p2-wins").html("Wins: 0");
        $("#p2-losses").html("Losses: 0");
        $("#p1-win").html("");
        $("#p2-win").html("");
        $("#tie").html("");

        var currentChat = $("#chat-area").val().trim();
        if (currentChat == "") {
            $("#chat-area").html("[SERVER MESSAGE] ~Seat 1 Available~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat!  You must log in to use the Chat!");
        } else {
            $("#chat-area").html(currentChat + "&#13" + "[SERVER MESSAGE] ~Seat 1 Available~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat! You must log in to use the Chat!");
            $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);

        }

      }

      var currentChat = $("#chat-area").val().trim();
      if(currentChat == ""){
        $("#chat-area").html("[SERVER MESSAGE] ~Welcome Spectator~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat! You must log in to use the Chat!");
      }
     

      if (p1Name != "") {
          $("#p1-name").html(p1Name);
      }else {
        $("#p1-name").html("Waiting for an opponent");
      }

      if (p2Name != "" && p1Name != "") {
          $("#announcer").html("Pick Rock Paper or Scissors!")

      }

      console.log("p1 finish data P1: " + p1Name + " P2: " + p2Name);

  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });

  //update user when RPSp2 is updated
  database.ref("RPSp2").on("value", function (snapshot) {
      console.log("p2 trigger");
      if (snapshot.numChildren() == 2 ) {
          p2Name = snapshot.val().p2NameKey;

      } else {
        p2Name = "";
        $("#announcer").html("Two players needed to play!")
        database.ref("/RPSinfo").set({
            p1ChoiceKey: "",
            p2ChoiceKey: "",
            p1WinsKey: 0,
            p1LossesKey: 0,
            p2WinsKey: 0,
            p2LossesKey: 0,
            tiesKey: 0,
        });
        $("#p1-wins").html("Wins: 0");
        $("#p1-losses").html("Losses: 0");
        $("#ties").html("Ties: 0");
        $("#p2-wins").html("Wins: 0");
        $("#p2-losses").html("Losses: 0");
        $("#p1-win").html("");
        $("#p2-win").html("");
        $("#tie").html("");

        var currentChat = $("#chat-area").val().trim();
        if (currentChat == "") {
            $("#chat-area").html("[SERVER MESSAGE] ~Seat 2 Available~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat! You must log in to use the Chat!");
        } else {
            $("#chat-area").html(currentChat + "&#13" + "[SERVER MESSAGE] ~Seat 2 Available~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat! You must log in to use the Chat!");
            $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);

        }

      }

      var currentChat = $("#chat-area").val().trim();
      if(currentChat == ""){
        $("#chat-area").html("[SERVER MESSAGE] ~Welcome Spectator~ Welcome to Rock Paper Scissors! Enter your name to take a seat. If you are spectating be the 1st refresh your browser and enter your name again to take a seat! You must log in to use the Chat!");
      }

      if (p2Name != "") {
          $("#p2-name").html(p2Name);
      } else {
        $("#p2-name").html("Waiting for an opponent");
      }

      if (p2Name != "" && p1Name != "") {
          $("#announcer").html("Pick Rock Paper or Scissors!")

      }

      console.log("p2 finish data P1:" + p1Name + "P2:" + p2Name);
  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });


  //update user when RPSinfo is updated
  database.ref("RPSinfo").on("value", function (snapshot) {
      p1Choice = snapshot.val().p1ChoiceKey;
      p2Choice = snapshot.val().p2ChoiceKey;
      p1Wins = snapshot.val().p1WinsKey;
      p1Losses = snapshot.val().p1LossesKey;
      p2Wins = snapshot.val().p2WinsKey;
      p2Losses = snapshot.val().p2LossesKey;
      ties = snapshot.val().tiesKey;

      if (p1Choice != "") {
          $("#announcer").html("Waiting on " + p2Name + "!");
          $("#p1-win").html("");
          $("#p2-win").html("");
          $("#tie").html("");
      }

      if (p2Choice != "") {
          $("#announcer").html("Waiting on " + p1Name + "!");
          $("#p1-win").html("");
          $("#p2-win").html("");
          $("#tie").html("");
      }

      $("#p1-wins").html("Wins: " + p1Wins);
        $("#p1-losses").html("Losses: " + p1Losses);
        $("#ties").html("Ties: " + ties);
        $("#p2-wins").html("Wins: " + p2Wins);
        $("#p2-losses").html("Losses: " + p2Losses);



      if (p2Choice != "" && p1Choice != "") {
          console.log("ran result");
          
          result();
      }

  }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });


  //=================================================================================
  // the code below is for counting how many users are viewing

  // connectionsRef references a specific location in our database.
  // All of our connections will be stored in this directory.
  var connectionsRef = database.ref("/connections");
  // '.info/connected' is a special location provided by Firebase that is updated every time
  // the client's connection state changes.
  // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
  var connectedRef = database.ref(".info/connected");
  // When the client's connection state changes...

  // connectedRef.on("value", function (snap) {});
  database.ref("RPS1").on("value", function (snap) {

      // If they are connected..
          
          // Add user to the connections list.
          /* var con = connectionsRef.push("player1"); */

          // Remove user from the connection list when they disconnect. 
        if(con2 != undefined) {
            console.log(con2);
          con2.onDisconnect().remove();
        }

  });

  // When first loaded or when the connections list changes...
  connectionsRef.on("value", function (snapshot) {

      // Display the viewer count in the html.
      // The number of online users is the number of children in the connections list.
      $("#watchers").text(snapshot.numChildren()); //TODO: I need to fix this and reimplement
  });

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