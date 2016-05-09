angular.module('YolkoApp')
.service('QuizService', QuizService);

function QuizService(FIREBASE_URL, $firebaseArray, $firebaseObject) {
  var quizQuestion1Url = new Firebase(FIREBASE_URL + '/quiz/question1/');
  var quizQuestion2Url = new Firebase(FIREBASE_URL + '/quiz/question2/');
  var quizQuestion3Url = new Firebase(FIREBASE_URL + '/quiz/question3/');
  var quizAnswer1AUrl = new Firebase(FIREBASE_URL + '/quiz/question1/answers/a/');
  var quizAnswer1BUrl = new Firebase(FIREBASE_URL + '/quiz/question1/answers/b/');
  var quizAnswer1CUrl = new Firebase(FIREBASE_URL + '/quiz/question1/answers/c/');

  var quizQuestion1 = $firebaseObject(quizQuestion1Url);
  var quizQuestion2 = $firebaseObject(quizQuestion2Url);
  var quizQuestion3 = $firebaseObject(quizQuestion3Url);


  var quizAnswers1A = $firebaseArray(quizAnswer1AUrl);
  var quizAnswers1B = $firebaseArray(quizAnswer1BUrl);
  var quizAnswers1C = $firebaseArray(quizAnswer1CUrl);

  return {
//questions
    quizQuestion1Url: quizQuestion1Url,
    quizQuestion2Url: quizQuestion2Url,
    quizQuestion3Url: quizQuestion3Url,
    quizQuestion1: quizQuestion1,
    quizQuestion2: quizQuestion2,
    quizQuestion3: quizQuestion3,

//answers
    quizAnswers1A: quizAnswers1A,
    quizAnswers1B: quizAnswers1B,
    quizAnswers1C: quizAnswers1C
  };
}
