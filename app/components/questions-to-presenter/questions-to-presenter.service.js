angular.module('YolkoApp')
.service('QuestionsToPresenterService', QuestionsService);

function QuestionsService(FIREBASE_URL, $firebaseArray) {
	var allQuestionsApiUrl = new Firebase(FIREBASE_URL + '/questions-to-presenter/');

    return {
        allQuestionsApiUrl: allQuestionsApiUrl,
        questions: $firebaseArray(allQuestionsApiUrl)
    };
}
