angular.module('YolkoApp')
.service('VotesService', VotesService);

function VotesService(FIREBASE_URL, $firebaseArray, $firebaseObject) {
	var allVotesApiUrl = new Firebase(FIREBASE_URL + "/votes");
	var allLikeVotesApiUrl = new Firebase(FIREBASE_URL + "/votes/likes");
	var allDislikeVotesApiUrl = new Firebase(FIREBASE_URL + "/votes/dislikes");

	// create an Array with all the attendees in the database with theis keys
	var votes = $firebaseArray(allVotesApiUrl);
	var likeVotesArray = $firebaseArray(allLikeVotesApiUrl);
	var dislikeVotesArray = $firebaseArray(allDislikeVotesApiUrl);

  return {
	  allVotesApiUrl: allVotesApiUrl,
	  votes: votes,

	  //Likes
	  allLikeVotesApiUrl: allLikeVotesApiUrl,
	  likeVotesArray: likeVotesArray,

	  //Dislikes
	  allDislikeVotesApiUrl: allDislikeVotesApiUrl,
	  dislikeVotesArray: dislikeVotesArray,
	  dislikeVotesArray: dislikeVotesArray,
  };
}
