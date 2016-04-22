/**
 * UI Component For Creating Cron Job Syntax To Send To Server
 * @version v1.0.0 - 2016-04-22 * @link https://github.com/RajanRastogi/angular-quartz-cron
 * @author Rajan Rastogi <rajan1311@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('templates-angularquartzcron', ['cronselection.html']);

angular.module("cronselection.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("cronselection.html",
    "<div class=\"cron-wrap\">\n" +
    "<span>Every: </span>\n" +
    "	<select class=\"cron-select\" ng-model=\"myFrequency.base\" ng-options=\"item.value as item.label for item in frequency\"></select>\n" +
    "\n" +
    "	<div class=\"select-options\">\n" +
    "		<span ng-show=\"myFrequency.base == 4\">on </span>\n" +
    "		<select ng-show=\"myFrequency.base == 4\" class=\"cron-select day-value\" ng-model=\"myFrequency.dayValue\" ng-options=\"(value | aqc_dayName) for value in dayValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 5\">on the </span>\n" +
    "		<select ng-show=\"myFrequency.base >= 5\" class=\"cron-select day-of-month-value\" ng-model=\"myFrequency.dayOfMonthValue\" ng-options=\"(value | aqc_numeral) for value in dayOfMonthValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base == 6\">of </span>\n" +
    "		<select ng-show=\"myFrequency.base == 6\" class=\"cron-select month-value\" ng-model=\"myFrequency.monthValue\" ng-options=\"(value | aqc_monthName) for value in monthValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 2\">at </span>\n" +
    "		<select ng-show=\"myFrequency.base >= 3\" class=\"cron-select hour-value\" ng-model=\"myFrequency.hourValue\" ng-options=\"value for value in hourValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base >= 3\"> : </span>\n" +
    "		<select ng-show=\"myFrequency.base >= 2\" class=\"cron-select minute-value\" ng-model=\"myFrequency.minuteValue\" ng-options=\"value for value in minuteValue\"></select>\n" +
    "		<span ng-show=\"myFrequency.base == 2\"> past the hour</span>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

'use strict';

angular.module('angular-quartz-cron', ['templates-angularquartzcron']);

'use strict';

angular.module('angular-quartz-cron', ['templates-angularquartzcron']);

'use strict';

angular.module('angular-quartz-cron')
.directive('quartzCronSelection', [
    'aqc.cronService',
    function(cronService) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                config : '=',
                output : '=?',
                init   : '=?',
                mode   : "=?"
            },
            templateUrl: function(element, attributes) {
              return attributes.template || 'cronselection.html';
            },
            link: function($scope) {

                var originalInit = undefined;
                var initChanged = false;

                $scope.frequency = [
                    {
                      value : 1,
                      label : 'Minute'  
                    },
                    {
                      value : 2,
                      label : 'Hour'  
                    },
                    {
                      value : 3,
                      label : 'Day'  
                    },
                    {
                      value : 4,
                      label : 'Week'  
                    },
                    {
                      value : 5,
                      label : 'Month'  
                    },
                    {
                      value : 6,
                      label : 'Year'  
                    }
                ];

                if (angular.isDefined($scope.init)) {
                    //console.log('init value found: ', $scope.init);
                    originalInit = angular.copy($scope.init);
                    originalInit = originalInit || "";
                    $scope.myFrequency = cronService.fromCron(angular.copy(originalInit));
                }

                $scope.$watch('init', function(newValue){
                    //console.log('watch on init fired!', newValue, originalInit);
                    if(angular.isDefined(newValue) && newValue && (newValue !== originalInit)){
                        initChanged = true;
                        $scope.myFrequency = cronService.fromCron(newValue);
                    }
                });

                if(typeof $scope.config === 'object' && !$scope.config.length){
                    var optionsKeyArray = Object.keys($scope.config.options);
                    for (var i in optionsKeyArray) {
                        var currentKey = optionsKeyArray[i].replace(/^allow/, '');
                        var originalKey = optionsKeyArray[i];
                        if(!$scope.config.options[originalKey]){
                            for(var b in $scope.frequency){
                                if($scope.frequency[b].label === currentKey){
                                    $scope.frequency.splice(b, 1);
                                }
                            }
                        }
                    }
                }

                $scope.minuteValue = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
                $scope.hourValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                $scope.dayOfMonthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
                $scope.dayValue = [1, 2, 3, 4, 5, 6, 7];
                $scope.monthValue = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

                $scope.$watch('myFrequency', function(n, o){
                    //console.log('myFrequency changed: ', n, initChanged);
                    if(n && (!o || n.base !== o.base) && !initChanged){
                        //console.log('base changed!', n, o);
                        if(n && n.base){
                            n.base = parseInt(n.base);
                        }
                        if(n && n.base && n.base >= 2) {
                            n.minuteValue = $scope.minuteValue[0];
                        }

                        if(n && n.base && n.base >= 3) {
                            n.hourValue = $scope.hourValue[0];
                        }

                        if(n && n.base && n.base === 4) {
                            n.dayValue = $scope.dayValue[0];
                        }

                        if(n && n.base && n.base >= 5) {
                            n.dayOfMonthValue = $scope.dayOfMonthValue[0];
                        }

                        if(n && n.base && n.base === 6) {
                            n.monthValue = $scope.monthValue[0];
                        }
                    } else if(n && n.base && o && o.base){
                        initChanged = false;
                    }
                    $scope.output = cronService.setCron(n);
                }, true);
            }
        };
    }
])
.filter('aqc_numeral', function() {
    return function(input) {
        switch (input) {
            case 1:
                return '1st';
            case 2:
                return '2nd';
            case 3:
                return '3rd';
            case 21:
                return '21st';
            case 22:
                return '22nd';
            case 23:
                return '23rd';
            case 31:
                return '31st';
            case null:
                return null;
            default:
                return input + 'th';
        }
    };
}).filter('aqc_monthName', function() {
    return function(input) {
        var months = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };

        if (input !== null && angular.isDefined(months[input])) {
            return months[input];
        } else {
            return null;
        }
    };
}).filter('aqc_dayName', function() {
    return function(input) {
        var days = {
            1: 'Sunday',
            2: 'Monday',
            3: 'Tuesday',
            4: 'Wednesday',
            5: 'Thursday',
            6: 'Friday',
            7: 'Saturday',
        };

        if (input !== null && angular.isDefined(days[input])) {
            return days[input];
        } else {
            return null;
        }
    };
});
'use strict';

angular.module('angular-quartz-cron')
.factory('aqc.cronService', function() {
    var service = {};

    service.setCron = function(n) {
        //  console.log('set cron called: ', n);
        var cron = ['0', '*', '*',  '*',  '*', '?'];

        if(n && n.base && n.base >= 2) {
            cron[1] = typeof n.minuteValue !== undefined ? n.minuteValue : '0';
        }

        if(n && n.base && n.base >= 3) {
            cron[2] = typeof n.hourValue !== undefined ? n.hourValue  : '*';
        }

        if(n && n.base && n.base === 4) {
            cron[3] = "?";
            cron[5] = n.dayValue;
        }

        if(n && n.base && n.base >= 5) {
            cron[3] = typeof n.dayOfMonthValue !== undefined ? n.dayOfMonthValue : '?';
        }

        if(n && n.base && n.base === 6) {
            cron[4] = typeof n.monthValue !== undefined ? n.monthValue : '*';
        }
        //  console.log('cron after setCron ', cron.join(' '));
        return cron.join(' ');
    };

    service.fromCron = function(value) { 
        //  console.log('set cron fired!');
       var cron = value.replace(/\s+/g, ' ').split(' ');
       var frequency = {base: '1'}; // default: every minute
       if(cron[1] === '*' && cron[2] === '*' && cron[3] === '*'  && cron[4] === '*' && cron[5] === '?') {
           frequency.base = 1; // every minute
       } else if(cron[2] === '*' && cron[3] === '*'  && cron[4] === '*' && cron[5] === '?') {
           frequency.base = 2; // every hour
       } else if(cron[3] === '*'  && cron[4] === '*' && cron[5] === '?') {
           frequency.base = 3; // every day
       } else if(cron[3] === '?') {
           frequency.base = 4; // every week
       } else if(cron[4] === '*' && cron[5] === '?') {
           frequency.base = 5; // every month
       } else if(cron[5] === '?') {
           frequency.base = 6; // every year
       }

       // console.log('frequency should be 5: ', frequency, cron);
       if (cron[1] !== '*') {
           frequency.minuteValue = parseInt(cron[1]);
       }
       if (cron[2] !== '*') {
           frequency.hourValue = parseInt(cron[2]);
       }
       if (cron[3] !== '*' && cron[3] !== '?') {
           frequency.dayOfMonthValue = parseInt(cron[3]);
       }
       if (cron[4] !== '*') {
           frequency.monthValue = parseInt(cron[4]);
       }
       if (cron[5] !== '*' && cron[5] !== '?') {
          frequency.dayValue = parseInt(cron[5]);
       }

       //frequency.base += ''; // 'cast' to string in order to set proper value on "every" modal

       // console.log('freq ', frequency);
       return frequency;
    };
   
   return service;
});
