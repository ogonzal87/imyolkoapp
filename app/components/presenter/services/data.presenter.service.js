angular.module('Presenter')
	.service("DataPresenterService", DataPresenterService);

function DataPresenterService(FIREBASE_URL, $firebaseObject, $firebaseArray) {
	// create a unique key for each attendee that comes in
	var randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 34);
	// create an Attendee object that will be automatically constructed on page load with defaulted attributes
	var defaultPresenter = {
		key: randomKey,
		startedAt: Firebase.ServerValue.TIMESTAMP,
		yolkoIsActive: false,
		lostIsActive: false,
		questionsIsActive: false,
		speedIsActive: false,
		selectedQuestionForAttendees: {},
		answers: {},
		hearingIsActive: false
	};

	// var currentPresenterApiUrl = new Firebase(FIREBASE_URL + "/presenter/" + defaultPresenter.key);
	var currentPresenterApiUrl = new Firebase(FIREBASE_URL + "/presenter/");
	// create an Object for the current presenter on the session
	var currentPresenterSyncObj = $firebaseObject(currentPresenterApiUrl);


	var selectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + "/presenter/");
	var selectedQuestionForAttendees = $firebaseArray(selectedQuestionForAttendeesUrl);

	var answersForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/');
	var choiceAForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/a/');
	var choiceBForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/b/');
	var choiceCForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/c/');



	return {
		defaultPresenter: defaultPresenter,
		currentPresenterApiUrl: currentPresenterApiUrl,
		currentPresenterSyncObj: currentPresenterSyncObj,
		selectedQuestionForAttendees: selectedQuestionForAttendees,
		answersForSelectedQuestionForAttendees: $firebaseArray(answersForSelectedQuestionForAttendeesUrl),
		answersForSelectedQuestionForAttendeesObj: $firebaseObject(answersForSelectedQuestionForAttendeesUrl),
		choiceAForSelectedQuestionForAttendees: $firebaseArray(choiceAForSelectedQuestionForAttendeesUrl),
		choiceBForSelectedQuestionForAttendees: $firebaseArray(choiceBForSelectedQuestionForAttendeesUrl),
		choiceCForSelectedQuestionForAttendees: $firebaseArray(choiceCForSelectedQuestionForAttendeesUrl)
	};
}
