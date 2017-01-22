angular.module('Presenter')
.service('ResetService', ResetService);

function ResetService(DataAttendeeService, DataPresenterService, VotesService, QuestionsToPresenterService) {

	var resetVolumeTracker = function() {
		_.each(DataAttendeeService.attendees, function(attendee) {
			attendee.volumeUp = '';
			DataAttendeeService.attendees.$save(attendee);
		});
	};

    var resetSpeedTracker = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.speed = '';
		    DataAttendeeService.attendees.$save(attendee);
	    });
    };

    var resetYolko = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    if (attendee.vote) {
			    attendee.vote = null;
		    }
		    DataAttendeeService.attendees.$save(attendee);
	    });

    };

    var resetPanicTracker = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.feeling = '';
		    DataAttendeeService.attendees.$save(attendee);
	    });
    };

    var resetCustomQuestion = function() {
			DataPresenterService.answersForSelectedQuestionForAttendeesUrl.remove();
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    if (attendee.chosenAnswer) {
			    attendee.chosenAnswer = null;
			    attendee.submittedChosenAnswer = false;
		    }
		    DataAttendeeService.attendees.$save(attendee);
	    });
    };

    var resetEverything = function() {
	    _.each(DataAttendeeService.attendees, function(attendee) {
		    attendee.feeling = '';
		    attendee.speed = '';
		    attendee.volumeUp = '';
		    attendee.vote = '';
		    DataAttendeeService.attendees.$save(attendee);
		    QuestionsToPresenterService.allQuestionsApiUrl.remove();
		    VotesService.allVotesApiUrl.remove();
	    });
    };

    var deleteEverything = function() {
	    DataAttendeeService.allAttendeesApiUrl.remove();
	    VotesService.allVotesApiUrl.remove();
	    QuestionsToPresenterService.allQuestionsApiUrl.remove();
    };


	return {
	    resetVolumeTracker: resetVolumeTracker,
	    resetSpeedTracker:   resetSpeedTracker,
	    resetYolko:          resetYolko,
	    resetPanicTracker:   resetPanicTracker,
			resetCustomQuestion: resetCustomQuestion,
	    resetEverything:     resetEverything,
	    deleteEverything:    deleteEverything
    };
}
