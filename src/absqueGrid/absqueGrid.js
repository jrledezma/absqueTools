/************************************************************************
  * Absque Grid
  * descripction: angularjs directive for create grid tables by using a 
  *               a single json object in the view controller
  * author: Jose Ledezma Cortes
  * company: absquesoft 
  * dependencies: bootstrap
***********************************************************************/

'use strict';

angular.module('absqueTools', ['ng'])
  .directive('absqueGrid', function($compile, $document, $filter) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        config: '=config'
      },template: '<div>' +
        '<div ng-show="config.showSearchInput">' +
        '<input class="form-control search-input mobile-margin" type="text" ng-model="search" placeholder="&#xf002; Búsqueda" ' +
        'ng-change="figureOutItemsToDisplay()"/>' +
        '</div>' +
        '<div class="table-responsive grid-container">' +
        '<table class="grid">' +
        '</table>' +
        '</div>' +
        '<div id="paginationContainer" class="row" style="margin-top:0"> ' +
        '<div class+"col-sm-12">' +
        '<uib-pagination boundary-links="true" max-size="config.maxPaginationSize" ng-class="{\'pull-right\': config.pagination.onRightSide}" ' +
        'items-per-page="config.itemsPerPage" total-items="filterLength" ng-model="currentPage" ' + 'ng-change="pageChanged()" '+
        'first-text="{{config.pagination.firstText}}" last-text="{{config.pagination.lastText}}" ' +
        'next-text="{{config.pagination.nextText}}" previous-text="{{config.pagination.previousText}}" /></uib-pagination>' +
        '</div>' +
        '</div>' +
        '</div>',
      link: function(scope, element, attrs) {
        startGrid();

        scope.$watch(function(){
          return scope.config.arrayOfValues;
        }, function(newValue, oldValue){
          if(newValue){
            buildPager();
          }
        }, true);

        function startGrid(){
          scope.buttonActions = [];
          scope.pagedItems = [];
          //defines deault values for the pagination sizes
          if(scope.config.itemsPerPage === undefined){
            scope.config.itemsPerPage = 6;
          }
          if(scope.config.maxPaginationSize === undefined){
            scope.config.maxPaginationSize = 10;
          }

          var table = element.find('table');
          table.append($compile(createHeader())(scope));
          table.append($compile(createBody())(scope));
        }

        /**************************************************
          * Table Creation
        **************************************************/
        function createHeader(){
          var headerTemplate = '<thead id="head" class="' + createClassesString(scope.config.headerClasses) + '"><tr>',
              columnHeaders = scope.config.fieldsToUse;
          for(var i in columnHeaders){
            var mobileShowClass = '';
            if(!columnHeaders[i].showInMobile){
              var mobileShowClass = 'not-show-in-mobile';
            }

            if(columnHeaders[i].show){
              headerTemplate += '<th class="' + mobileShowClass + '" style="margin-bottom:10pt;' + createStylesString(scope.config.rowStyles) + '">';
              //make sorteable columns
              if(columnHeaders[i].useToSort){
                headerTemplate += '<a href="" ng-click="sortType = \'' + columnHeaders[i].keyName +'\';ascSort = !ascSort">' +
                  columnHeaders[i].columnTitle + ' ' +
                  '<span ng-show="sortType === \'' +  columnHeaders[i].keyName + '\' && !ascSort" class="fa fa-caret-down">' +
                  '</span>' +
                  '<span ng-show="sortType === \'' +  columnHeaders[i].keyName + '\' && ascSort" class="fa fa-caret-up">' +
                  '</span>' +
                  '</a>';
              } else{
                headerTemplate += columnHeaders[i].columnTitle;
              }
               headerTemplate += '</th>';
            }
          }
          if((scope.config.buttonList) && (scope.config.buttonList.length > 0)){
            headerTemplate += '<th></th>';
          }
          headerTemplate += '</tr></thead>';
          return headerTemplate;
        }

        function createBody(){
          var body = element.find('tbody');
          body.remove();
          var bodyTemplate = '<tbody id="body">' +
            '<tr ng-repeat="item in pagedItems | orderBy:sortType:ascSort" class="' + createClassesString(scope.config.rowClasses) + 
              '" style="' + createStylesString(scope.config.rowStyles) + '">';
            var idKeyName = '';
            for(var i in scope.config.fieldsToUse){
              var field = scope.config.fieldsToUse[i];
              if((idKeyName === '') &&
                (field.isIdValue)){
                  idKeyName = field.keyName;
              }
              if(field.show){

                var mobileShowClass = ''
                if(!field.showInMobile){
                  mobileShowClass = 'not-show-in-mobile';
                }

                //boolean
                if(field.isBoolean){
                  bodyTemplate += '<td ng-show="{{item.' + field.keyName +'}}" class="' + mobileShowClass + createClassesString(field.classes) + 
                    '" style="' + createStylesString(field.styles) + '">' + field.values.whenTrue + '</td>';
                  bodyTemplate += '<td ng-hide="{{item.' + field.keyName +'}}" class="' + mobileShowClass + createClassesString(field.classes) +
                    '" style="' + createStylesString(field.styles) + '">' + field.values.whenFalse + '</td>';
                }
                //image
                else if(field.isImage){
                  bodyTemplate += '<td>' +
                    '<img src="{{item.'+ field.keyName + '}}" class="' + mobileShowClass + createClassesString(field.classes) + 
                      '" style="' + createStylesString(field.styles) + '"/>' +
                    '</td>';
                }
                //text
                else {
                  if(field.hardCodedValue){
                    bodyTemplate += '<td class="' + mobileShowClass + createClassesString(field.classes) + 
                      '" style="' + createStylesString(field.styles) + '">{{item.' + field.hardCodedValue + '}}</td>';  
                  } else {
                    bodyTemplate += '<td class="' + mobileShowClass + createClassesString(field.classes) + 
                      '" style="' + createStylesString(field.styles) + '">{{item.' + field.keyName + '}}</td>';
                  }
                }
              }

              //adds the buttons list
              if(parseInt(i) === parseInt(scope.config.fieldsToUse.length - 1)){
                bodyTemplate += createButtonList(idKeyName);
              }
          }

          bodyTemplate += '</tr></tbody>';
          return bodyTemplate;
        }

        function createButtonList(){
          var buttonControl = '<td><ul class="gbutton-group-padding">';

          for(var h in scope.config.buttonList){
            buttonControl += '<li style="margin-bottom:2pt;list-style-type:none;width=100%;">';
            switch (scope.config.buttonList[h].type) {
              case 'custom':
                buttonControl += '<li style="margin-bottom:2pt;list-style-type:none;width=100%;">';
                buttonControl += scope.config.buttonList[h].html
                    .replace(':action', 'ng-click="' + createButtonFunctionality(h, scope.config.buttonList[h]) + '"')
                    .replace(':text', scope.config.buttonList[h].text);
                break;
              case 'delete':
                buttonControl += '<a href="" style="display: inline;" ng-click="' + createButtonFunctionality(h, scope.config.buttonList[h]) + '">' +
                  '<i class="fa fa-times text-danger"></i><span class="desktop-button">&nbsp;' + scope.config.buttonList[h].text + '</span></a>';

                buttonControl += '</li>';
                break;
              case 'detail':
                buttonControl += '<a href="" style="display: inline;" ng-click="' + createButtonFunctionality(h, scope.config.buttonList[h]) + '">' +
                  '<i class="fa fa-eye text-success"></i><span class="desktop-button">&nbsp;' + scope.config.buttonList[h].text + '</span></a>';

                buttonControl += '</li>';
                break;
              case 'edit':
                buttonControl += '<a href="" style="display: inline;" ng-click="' + createButtonFunctionality(h, scope.config.buttonList[h]) + '">' +
                  '<i class="fa fa-list-alt text-primary"></i> <span class="desktop-button">&nbsp;' + scope.config.buttonList[h].text + '</span></a>';

                buttonControl += '</li>';
                break;
              default:

            }
            buttonControl += '</li>';
          }
          buttonControl += '</ul></td>';
          return buttonControl;
        }

        function createButtonFunctionality(index, button){
          scope.buttonActions.push(scope.config.buttonList[index].functionToApply);
          var buttonClick = 'buttonActions[' + index + '](';

          for(var i in button.parameters){
            if(button.parameters[i].isRowItem){
              buttonClick += 'item';
            } else if(button.parameters[i].isGridValue) {
              buttonClick += 'item.' + button.parameters[i].keyValue;
            } else {
              buttonClick += button.parameters[i].customValue;
            }
          }
          buttonClick += ')';
          return buttonClick; 
        }

        function createClassesString(classes) {
          var classesStr = ''
          for(var i in classes){
            classesStr += classes[i] + ' ';
          }
          return classesStr;
        }

        function createStylesString(styles) {
          var stylesStr = ''
          for(var i in styles){
            stylesStr += styles[i] + ';';
          }
          return stylesStr;
        }

        /**************************************************
          * Pagination
        **************************************************/
        function buildPager() {
          scope.pagedItems = [];
          scope.itemsPerPage = scope.config.itemsPerPage;
          scope.currentPage = 1;
          scope.figureOutItemsToDisplay();
        }

        scope.figureOutItemsToDisplay = function() {
          scope.filteredItems = $filter('filter')(scope.config.arrayOfValues, {
            $: scope.search
          });
          scope.filterLength = scope.filteredItems.length;
          var begin = ((scope.currentPage - 1) * scope.itemsPerPage);
          var end = begin + scope.itemsPerPage;
          scope.pagedItems = scope.filteredItems.slice(begin, end);
        };

        scope.pageChanged = function () {
          scope.figureOutItemsToDisplay();
        };
      }
    };
  });
