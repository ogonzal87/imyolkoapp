angular.module('Presenter')
.service('ResetService', ResetService);

function ResetService(DataAttendeeService, VotesService, QuestionsService, QuizService) {

	var resetVolumeTracker = function() {
		_.each(DataAttendeeService.attendees, function(attendee) {
			attendee.volumeUp = 'no';
			DataAttendeeService.attendees.$save(attendee);
		});
	};

    var resetSpeedTracker = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.speed = 0;
		    DataAttendeeService.attendees.$save(attendee);
	    });
    };

    var resetYolko = function() {
	    VotesService.allVotesApiUrl.remove();
    };

    var resetPanicTracker = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.feeling = 'fine';
		    DataAttendeeService.attendees.$save(attendee);
	    });
    };

    var resetEverything = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.feeling = 'fine';
		    attendee.speed = 0;
		    attendee.volumeUp = 0;
		    attendee.vote = 'like';
		    DataAttendeeService.attendees.$save(attendee);
		    QuestionsService.allQuestionsApiUrl.remove();
		    VotesService.allVotesApiUrl.remove();
		    QuizService.quizQuestion1Url.remove();
	    });
    };

    var deleteEverything = function() {
	    DataAttendeeService.allAttendeesApiUrl.remove();
	    VotesService.allVotesApiUrl.remove();
	    QuestionsService.allQuestionsApiUrl.remove();
	    QuizService.quizQuestion1Url.remove();
    };


	return {
	    resetVolumeTracker: resetVolumeTracker,
	    resetSpeedTracker:   resetSpeedTracker,
	    resetYolko:          resetYolko,
	    resetPanicTracker:   resetPanicTracker,
	    resetEverything:     resetEverything,
	    deleteEverything:    deleteEverything
    };
}
