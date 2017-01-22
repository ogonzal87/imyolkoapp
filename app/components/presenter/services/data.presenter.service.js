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
		hearingIsActive: false
	};

	var currentPresenterApiUrl = new Firebase(FIREBASE_URL + "/presenter/");
	// create an Object for the current presenter on the session
	var currentPresenterSyncObj = $firebaseObject(currentPresenterApiUrl);

	var customQuestionsToAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/customQuestionsToAttendees/');

	var customQuestionsToAttendeesArr = $firebaseArray(customQuestionsToAttendeesUrl);


	var answersForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/');
	var choiceAForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/a/');
	var choiceBForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/b/');
	var choiceCForSelectedQuestionForAttendeesUrl = new Firebase(FIREBASE_URL + '/presenter/answers/c/');



	return {
		defaultPresenter: defaultPresenter,
		currentPresenterApiUrl: currentPresenterApiUrl,
		currentPresenterSyncObj: currentPresenterSyncObj,
		customQuestionsToAttendeesArr: customQuestionsToAttendeesArr,
		answersForSelectedQuestionForAttendeesUrl: answersForSelectedQuestionForAttendeesUrl,
		answersForSelectedQuestionForAttendees: $firebaseArray(answersForSelectedQuestionForAttendeesUrl),
		answersForSelectedQuestionForAttendeesObj: $firebaseObject(answersForSelectedQuestionForAttendeesUrl),
		choiceAForSelectedQuestionForAttendees: $firebaseArray(choiceAForSelectedQuestionForAttendeesUrl),
		choiceBForSelectedQuestionForAttendees: $firebaseArray(choiceBForSelectedQuestionForAttendeesUrl),
		choiceCForSelectedQuestionForAttendees: $firebaseArray(choiceCForSelectedQuestionForAttendeesUrl)
	};
}
