angular.module('Presenter')
	.service("DataPresenterService", DataPresenterService);

function DataPresenterService(FIREBASE_URL, $firebaseObject, $firebaseArray) {
	// create a unique key for each attendee that comes in
	var randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 34);
	// create an Attendee object that will be automatically constructed on page load with defaulted attributes
	var defaultPresenter = {
		name: 'Oscar',
		key: randomKey,
		startedAt: Firebase.ServerValue.TIMESTAMP
	};

	// var currentPresenterApiUrl = new Firebase(FIREBASE_URL + "/presenter/" + defaultPresenter.key);
	var currentPresenterApiUrl = new Firebase(FIREBASE_URL + "/presenter/");
	var allPresentersApiUrl = new Firebase(FIREBASE_URL + "/presenter/");
	// create an Object for the current presenter on the session
	var currentPresenterSyncObj = $firebaseObject(currentPresenterApiUrl);
	var presenters = $firebaseArray(allPresentersApiUrl);



	return {
		defaultPresenter: defaultPresenter,
		currentPresenterApiUrl: currentPresenterApiUrl,
		currentPresenterSyncObj: currentPresenterSyncObj,
		presenters: presenters
	};
}
