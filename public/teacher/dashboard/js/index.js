// Initialize Firebase
var config = {
	apiKey: "AIzaSyASerxcHDiIiV3BfiX1Vfkxr9xYKR5tRtc",
	authDomain: "notehb-58764.firebaseapp.com",
	databaseURL: "https://notehb-58764.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "678265991392"
};
firebase.initializeApp(config);

var oldInterim = '';

$(document).ready(function() {
	var database = firebase.database();
	var uid = getParameterByName("uid");

	var seconds = 0;			//Time elapsed in seconds
	var minutes = 0;
	var hours = 0;
	var paused = true;
	var stopped = false;
	var n;
	var time = "";
	$("#stop").css("opacity", "0.2");

	window.setInterval(function() {
		if (!paused && !stopped) {
			seconds += 1;
			if (seconds >= 60) {
				seconds = 0;
				minutes += 1;
			}
			if (minutes >= 60) {
				minutes = 0;
				hours += 1
			}
			document.getElementById("time-elapsed").innerHTML = hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + 
				(seconds < 10 ? "0" + seconds : seconds);
		}
	}, 1000);

	$("#play-pause").click(function() {
		if ($(this).attr("value") == "paused" && !(paused = paused == stopped) && !stopped) {
			$(this).attr("value", "playing");
			$(this).html('<img src="../../img/pause.png" alt="A pause button" />');
			$("#stop").css("opacity", 1);
			startListening(null);
		}
		else {
			paused = true;
			$(this).attr("value", "paused");
			if (!stopped)
				$(this).html('<img src="../../img/play.png" alt="A play button" />');
			startListening(null);
		}
	})
	$("#stop").click(function () {
		startListening(null);
		var playpause = $("#play-pause");
		if (!stopped && playpause.attr("value") == "playing") {
			playpause.attr("value", "paused");
			playpause.html('<img src="../../img/play.png" alt="A play button" />');
		}
		if (seconds != 0 || minutes != 0 || hours != 0) {
			stopped = true;
			$(playpause).html('<img src="../../img/play.png" alt="A play button" />');
			$(playpause).css("opacity", "0.2");
			$(this).css("opacity", 0.2);
		}
	})


	// Check if browser supports WebSpeech API
	if (!('webkitSpeechRecognition' in window)) {
	  alert("Your browser doesn't support the Web Speech API :(");
	} else {
	  var recognizing = false;
	  var recognition = new webkitSpeechRecognition();
	  recognition.continuous = true;
	  recognition.interimResults = true;

	  function startListening(event) {
	    if (recognizing) {
	      recognition.stop();
	    }else {
	      recognition.lang = "en-CA";
	      recognition.start();
	    }
	  }
	}
	// Create Stop Button once WebSpeech API starts
	  recognition.onstart = function() {
	    recognizing = true;
	  };

	  // Create Start Button once WebSpeech API ends
	  recognition.onend = function() {
	    recognizing = false;
	  };  

	    // Display WebSpeech API errors
	  recognition.onerror = function(event) {
	    if (event.error == 'no-speech') {
	      alert('No speech was detected');
	    }
	    else if (event.error == 'audio-capture') {
	      alert('Could not detect a microphone on your device');
	    }
	    else if (event.error == 'not-allowed') {
	      alert('Cannot access your microphone. Did you grant permissions?');
	    }
	    else {
	      alert('Unknown Error with Speech Recognition - ' + event.error);
	    }
	  };

	  // Handle WebSpeech API results
	  recognition.onresult = function(event) {
	    var interim_transcript = '';
	    var final_transcript = '';
	        if (typeof(event.results) == 'undefined') {
	          recognition.onend = null;
	          recognition.stop();
	          upgrade();
	          return;
	        }
	        for (var i = event.resultIndex; i < event.results.length; ++i) {
	          if (event.results[i].isFinal) {
	            final_transcript += event.results[i][0].transcript;
	          } else {
	            interim_transcript += event.results[i][0].transcript;
	          }
	        }
	        var oldText = $("textarea").html();
	        var oldInterim = 
	        // var oldText = $("#interim_textarea").html();
	        // console.log(oldText);
	        // console.log(oldInterim);
	        // oldText = oldText.substring(0, oldText.length - oldInterim.length);
	        // if (interim_transcript.length > 0) {
	        // 	oldInterim = interim_transcript;
	        // }
	        // if ((final_transcript + interim_transcript).length > 0) {
	       	// 	$("#textarea").text(final_transcript + interim_transcript);	
	        // }
	        // // $("#textarea").text(final_transcript + interim_transcript);
	        // // console.log(final_transcript + " F");
	        // console.log(interim_transcript + " F");
	        $("#textarea").append(final_transcript);
	        // $("#interim_textarea").text(interim_transcript);
	  };

	return firebase.database().ref('/teachers/' + uid).once('value')
	.then(function(snapshot) {
		var user = snapshot.val();
		$("#classcode").text("Class Code:\n" + user.classCode);
	});

});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function addTeacher(userId, name, email, classCode) {
	firebase.database().ref('teachers/' + userId).set({
		username: name,
		email: email,
		classCode : classCode
	});
}
