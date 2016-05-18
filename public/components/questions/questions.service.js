angular.module('YolkoApp')
.service('QuestionsService', QuestionsService);

function QuestionsService(FIREBASE_URL, DataAttendeeService, $firebaseArray, $firebaseObject) {
  var allQuestionsApiUrl = new Firebase(FIREBASE_URL + '/attendees/' + DataAttendeeService.defaultAttendee.key + '/questions');
  var questions = $firebaseArray(allQuestionsApiUrl);

  return {
    allQuestionsApiUrl: allQuestionsApiUrl,
    questions: questions
  };
}
