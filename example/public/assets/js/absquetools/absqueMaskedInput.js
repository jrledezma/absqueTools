/***********************************************************************
  * Absque Masked Input
  * descripction: angularjs directive for create dymanic masked inputs
  * author: Jose Ledezma Cortes
  * company: absquesoft 
  * dependencies: bootstrap
  *               ng-mask
***********************************************************************/

'use strict';

angular.module('absqueTools')
  .directive('absqueMaskedInput', function($compile, $document, $filter) {

  return {
    restrict: 'E',
    replace: true,
    scope: {
        ngModel: '='
    },
    link: function(scope, element, attrs) {

      attrs.$observe('maskvalue', function(){
        if(!attrs.idvalue){
          attrs.idvalue = 'maskedInput'
        }
        var input = '<input id="' + attrs.idvalue + '" name="' + attrs.idvalue + '" type="text" class="form-control" ng-model="ngModel" ' +
          'placeholder="' + attrs.placeholder + '" ';
        //mask to apply
        if(attrs.maskvalue){
          input += 'mask="' + attrs.maskvalue + '" ';
        }
        //disabled expression
        if(attrs.disabledExpression){
          input += 'ng-disabled=' + attrs.disabledExpression + ' ';
        }
        //the maskedInput is required?
        if(attrs.isrequired === 'true'){
          input += 'required ';
        }
        input += '>';
        element.find('#' + attrs.idvalue).remove();
        element.append($compile(input)(scope));
      });
    }
  };
});
