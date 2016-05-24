angular.module('YolkoApp')
.service('QuestionsService', QuestionsService);

function QuestionsService(FIREBASE_URL, $firebaseArray) {
  // var allQuestionsApiUrl = new Firebase(FIREBASE_URL + '/attendees/' + DataAttendeeService.defaultAttendee.key + '/questions');
  var allQuestionsApiUrl = new Firebase(FIREBASE_URL + '/questions-to-presenter/');
  var questions = $firebaseArray(allQuestionsApiUrl);

  return {
    allQuestionsApiUrl: allQuestionsApiUrl,
    questions: questions
  };
}
