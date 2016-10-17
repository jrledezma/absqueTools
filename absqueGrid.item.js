'use strict';

angular.module('absqueTools', ['ng'])
  .directive('absqueGridItem', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        model: '=model',
        inputType: '@inputType',
        inputMaxLength: '@inputMaxLength',
        viewDataClasses: '@viewDataClasses',
        inputClasses: '@inputClasses'
      },
      template: '<div style="width:100%">' +
        '<p class="{{viewDataClasses}}" ng-hide="editValue">' +
        '{{model}}' +
        '</p>' +
        '<input type="{{inputType}}" ng-show="editValue" maxlength="{{inputMaxLength}}" ' +
        'class="{{inputClasses}}" style="margin-top:5pt;margin-bottom:5pt;" ng-model="model"/>' +
        '</div>',
      link: function(scope, element, attrs, ctrl) {
        scope.editValue = false;
        var oldValue = scope.model;
        //focusout event
        element.bind('focusout', function(event) {
          scope.editValue = false;
          scope.$apply();
        });
        element.bind('click', function(event) {
          scope.editValue = true;
          scope.$apply();
          element[0].children[1].focus();
        });
        element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            scope.editValue = false;
          } else if (event.which === 27) {
            scope.model = oldValue;
            scope.editValue = false;
          }
          scope.$apply();
        });
        return scope.model;
      }
    };
  });
