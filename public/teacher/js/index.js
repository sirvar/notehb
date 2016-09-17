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
	var provider = new firebase.auth.GoogleAuthProvider();
	var database = firebase.database();
	
	$("#signin-teacher").click(function() {
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			var user = result.user;
			// Gen class code
			var classCode = genClassCode();

			return firebase.database().ref('/teachers/' + user.uid).once('value')
			.then(function(snapshot) {
				if (snapshot.val() == null) {
					addTeacher(user.uid, user.displayName, user.email, classCode);
				}
			});

		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // The email of the user's account used.
		  var email = error.email;
		  // The firebase.auth.AuthCredential type that was used.
		  var credential = error.credential;
		  console.log(errorMessage)
		});
	});
});


function addTeacher(userId, name, email, classCode) {
	firebase.database().ref('teachers/' + userId).set({
		username: name,
		email: email,
		classCode : classCode
	});
}

function genClassCode() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 8; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}