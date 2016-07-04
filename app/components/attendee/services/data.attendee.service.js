angular.module('Attendee')
.service("DataAttendeeService", DataAttendeeService);

function DataAttendeeService(FIREBASE_URL, $firebaseArray, $firebaseObject) {
	// create a unique key for each attendee that comes in
	var randomKey = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
	// create an Attendee object that will be automatically constructed on page load with defaulted attribites
	var defaultAttendee = {
		feeling: 'fine',
		speed: 0,
		volumeUp: 'no',
		key: randomKey,
		startedAt: Firebase.ServerValue.TIMESTAMP
	};
	var allAttendeesApiUrl = new Firebase(FIREBASE_URL + "/attendees");
	var currentAttendeeApiUrl = new Firebase(FIREBASE_URL + "/attendees/" + defaultAttendee.key);

	// create an Object for the current attendee on the session
	var currentAttendeeSyncObj = $firebaseObject(currentAttendeeApiUrl);
	var attendees = $firebaseArray(allAttendeesApiUrl);

	return {
		defaultAttendee: defaultAttendee,
		allAttendeesApiUrl: allAttendeesApiUrl,
		currentAttendeeApiUrl: currentAttendeeApiUrl,
		currentAttendeeSyncObj: currentAttendeeSyncObj,

		//Arrays
		// create an Array with all the attendees in the database with theis keys
		attendees: attendees
	};
}
