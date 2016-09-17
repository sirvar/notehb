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