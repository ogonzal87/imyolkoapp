angular.module('YolkoApp')
.service('QuizChartService', QuizChartService);

function QuizChartService(QuizService) {
  var self = this;

  var chart =  new Chartist.Bar('.ct-chart', {
    labels: ['A', 'B', 'C'],
    series: [self.answersA, self.answersB, self.answersC]
  }, {
    distributeSeries: true
  });


  return {
    chart: chart,
    answersA: self.answersA,
    answersB: self.answersB,
    answersC: self.answersC
  };
}
