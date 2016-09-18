// Initialize Firebase
var config = {
	apiKey: "AIzaSyASerxcHDiIiV3BfiX1Vfkxr9xYKR5tRtc",
	authDomain: "notehb-58764.firebaseapp.com",
	databaseURL: "https://notehb-58764.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "678265991392"
};
firebase.initializeApp(config);


$(document).ready(function() {
	var database = firebase.database();
	var uid = getParameterByName("uid");
	var teacherUid = getParameterByName("teacher");

	var i = 0;
	function checkForUpdate() {
	    if(i < 1000000) {
	        return firebase.database().ref('/teachers/' + teacherUid).once('value')
	        .then(function(snapshot) {
	        	var teacher = snapshot.val();

	        	$(".lined").text(teacher.latestNote);
	        });
	        i++;
	        // Continue the loop in 3s
	        setTimeout(checkForUpdate, 1500);
	    }
	}
	// Start the loop
	setTimeout(checkForUpdate, 0);
	return firebase.database().ref('/teachers/' + teacherUid).once('value')
	.then(function(snapshot) {
		var teacher = snapshot.val();

		$("#classcode").text("Class Code:\n" + teacher.classCode);
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