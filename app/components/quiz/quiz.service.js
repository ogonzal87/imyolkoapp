angular.module('YolkoApp')
.service('QuizService', QuizService);

function QuizService(FIREBASE_URL, DataAttendeeService, $firebaseArray, $firebaseObject) {
  var quizQuestion1Url = new Firebase(FIREBASE_URL + '/quiz/question1/');
  var quizQuestion2Url = new Firebase(FIREBASE_URL + '/quiz/question2/');
  var quizQuestion3Url = new Firebase(FIREBASE_URL + '/quiz/question3/');

  var quizQuestion1 = $firebaseObject(quizQuestion1Url);
  var quizQuestion2 = $firebaseObject(quizQuestion2Url);
  var quizQuestion3 = $firebaseObject(quizQuestion3Url);

  return {
    quizQuestion1Url: quizQuestion1Url,
    quizQuestion2Url: quizQuestion2Url,
    quizQuestion3Url: quizQuestion3Url,
    quizQuestion1: quizQuestion1,
    quizQuestion2: quizQuestion2,
    quizQuestion3: quizQuestion3
  };
}
