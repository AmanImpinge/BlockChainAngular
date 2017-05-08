
myApp.controller('activityCalenderCtrl', function (moment, alert, RequestUtils) {

      var vm = this;
      vm.events = [];
      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
      vm.viewDate = new Date();
      getActivityList(moment);
      function getActivityList(moment) {
          RequestUtils.MakeGetCall(RequestUtils.ServerPath() + "/Activity/GetActivityList", {}, function (response) {
              if (response.Status == "OK") {
                  vm.ActivityList = response.Data;

                  $.each(vm.ActivityList, function () {
                      //console.log(moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate());
                      //debugger;
                     //console.log($(this).attr('ActStartTime'));

                      vm.events.push({ title: $(this).attr('ActName'),activityType:$(this).attr('ActType'), type: 'info', startsAt: new Date($(this).attr('ActStartTime')), endsAt: new Date($(this).attr('ActEndTime')), desc: $(this).attr('ActDesc') });
                  });
              }
              else {
                  console.log(response);
              }
          }, function (errorResponse) {
              console.log(errorResponse);
          })
      };
      //vm.events = [
      //  {
      //      title: 'An event',
      //      type: 'warning',
      //      startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
      //      endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
      //      draggable: true,
      //      resizable: true
      //  }, {
      //      title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
      //      type: 'info',
      //      startsAt: moment().subtract(1, 'day').toDate(),
      //      endsAt: moment().add(5, 'days').toDate(),
      //      draggable: true,
      //      resizable: true
      //  }, {
      //      title: 'This is a really long event title that occurs on every year',
      //      type: 'important',
      //      startsAt: moment().startOf('day').add(7, 'hours').toDate(),
      //      endsAt: moment().startOf('day').add(19, 'hours').toDate(),
      //      recursOn: 'year',
      //      draggable: true,
      //      resizable: true
      //  }
      //];

      vm.isCellOpen = true;

      vm.eventClicked = function (event) {
          alert.show('Clicked', event);
      };

      vm.eventEdited = function (event) {
          alert.show('Edited', event);
      };

      vm.eventDeleted = function (event) {
          alert.show('Deleted', event);
      };

      vm.eventTimesChanged = function (event) {
          alert.show('Dropped or resized', event);
      };

      vm.toggle = function ($event, field, event) {
          $event.preventDefault();
          $event.stopPropagation();
          event[field] = !event[field];
      };

  });
