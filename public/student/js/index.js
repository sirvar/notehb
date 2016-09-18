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

	$("#signin-student").click(function() {
		var code = $("#classCode").val();

		if (code.length != 8) {
			alert("Please enter a valid class code provided by your teacher.");
			$("#classCode").val("");
			return false;
		}

		return firebase.database().ref('teachers').orderByChild("classCode").equalTo(code)
		.on("child_added", function(snapshot) {
			var teacherUid = snapshot.key;
			firebase.auth().signInWithPopup(provider).then(function(result) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				var token = result.credential.accessToken;
				// The signed-in user info.
				var user = result.user;
				addStudent(user.uid, teacherUid, user.displayName, user.email);
				window.location.href = "/student/dashboard/?uid=" + user.uid + "&teacher=" + teacherUid;
				
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
});


function addStudent(userId, teacherId, name, email) {
	firebase.database().ref('teachers/' + teacherId + "/students/" + userId).set({
		username: name,
		email: email
	});
}