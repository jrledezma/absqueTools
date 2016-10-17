'use strict';

angular
	.module('absqueGridExample')
	.controller('homeCtrl', homeCtrl);

function homeCtrl($rootScope, $uibModal) {

	var vm = this;		
	startExample();


	/************************************************
		* private functions
	************************************************/
	function startExample() {

		vm.stockList = [
			{
				id: 1,
				pic: './assets/images/stocks/hammer.png',
				sku: 'sku-123-456',
				name: 'Hammer',
				price: '2.95',
				details: 'You can use it for hammer nails',
				inStock: true,
				status: true
			}, {
				id: 2,
				pic: './assets/images/stocks/screwdriver.png',
				sku: 'sku-223-496',
				name: 'Screwdriver',
				price: '1.50',
				details: 'Screw botls...',
				inStock: true,
				status: true
			}, {
				id: 3,
				pic: './assets/images/stocks/cuttingPliers.jpg',
				sku: 'sku-567-234',
				name: 'Cutting Pliers',
				price: '3.95',
				details: 'Holds or cuts staff',
				inStock: true,
				status: true
			}, {
				id: 4,
				pic: './assets/images/stocks/tapeMeasure.jpg',
				sku: 'sku-765-006',
				name: 'Tape Measure',
				price: '1.99',
				details: 'For measure things',
				inStock: false,
				status: true
			}, {
				id: 5,
				pic: './assets/images/stocks/adjustableSpanner.png',
				sku: 'sku-999-126',
				name: 'Adjustable Spanner',
				price: '0.99',
				details: 'for adjstud thins like cap screws...',
				inStock: false,
				status: true
			}, {
				id: 6,
				pic: './assets/images/stocks/chainsaw.png',
				sku: 'sku-864-000',
				name: 'Chainsaw',
				price: '11.99',
				details: 'To cut things...',
				inStock: true,
				status: true
			}, {
				id: 7,
				pic: './assets/images/stocks/drill.png',
				sku: 'sku-707-020',
				name: 'Drill',
				price: '07.99',
				details: 'You can make holes and screw some bolts...',
				inStock: true,
				status: true
			}
		];
		//absque grid configuration.
		vm.gridConfiguration  = {
			arrayOfValues: vm.stockList,
			itemsPerPage: 5,
			maxPaginationSize: 5,
			showSearchInput: true,
			headerClasses: ['grid-header'],
			fieldsToUse: [
				{
					keyName: 'id',
          columnTitle: '',
					isIdValue: true,
					show: false
				}, {
					keyName: 'pic',
          columnTitle: '',
					show: true,
					isImage: 'true',
					showInMobile: true
				}, {
					keyName: 'sku',
					columnTitle: 'Stock Unit',
					show: true,
					useToSort: true,
					showInMobile: true
				}, {
					keyName: 'name',
					columnTitle: 'Name',
					show: true,
					useToSort: true,
					showInMobile: true
				}, {
					keyName: 'price',
					columnTitle: 'Price',
					show: true,
					useToSort: true,
					showInMobile: true,
					classes: ['text-success'],
					styles: ['font-weight:bold']
				}, {
					columnTitle: 'Details',
          keyName: 'details',
          show: true,
          useToSort: true,
					showInMobile: false
				}, {
					keyName: 'inStock',
					columnTitle: 'In Stock',
					show: true,
					isBoolean: true,
					values: {
						whenTrue: 'Yes',
						whenFalse: 'No'
					},
					useToSort: true,
					showInMobile: true
				}, {
          keyName: 'status',
          columnTitle: 'Status',
          isBoolean: true,
					showInMobile: false,
          values: {
            whenTrue: 'Active',
            whenFalse: 'Inactive'
          },
          show: true,
          useToSort: true
				}
			],
			buttonList: [{
				type: 'delete',
				text: 'Delete',
				parameters:[
					{
						name: 'item',
						isRowItem: true,
						keyValue: ''
					}],
				functionToApply: removeStock
			}, {
				type: 'detail',
				text: 'Detail',
				parameters:[
					{
						name: 'stock',
						isRowItem: true	
					}],
				functionToApply: openDetailsModal
			}],
			pagination: {
				onRightSide: true,
				firstText: 'First',
				nextText: 'Next',
				previousText: 'Previous',
				lastText: 'Last'
			}
		};
	}

	function openDetailsModal(stock){
		var modal = $uibModal.open({
			animation: true,
      keyboard: false,
      backdrop: false,
      templateUrl: './views/modals/stock.modal.html',
      size: 'md',
      controller: modalCtrl,
      controllerAs: 'vm',
      resolve: {
      	stock: function() {
      		return stock;
      	}
      }
		}).result.then(function(stock){
			for(var i in vm.stockList){
				if(stock.id === vm.stockList[i].id){
					vm.stockList[i] = {
						id: stock.id,
						sku: stock.sku,
						pic: stock.pic,
						name: stock.name,
						details: stock.details,
						price: parseFloat(stock.price),
						inStock: stock.inStock,
						status: stock.status
					}
					break;
				}
			}
		});
	}

	function removeStock(item) {
		for(var i in vm.stockList){
			if(item.id === vm.stockList[i].id){
				vm.stockList.splice(i,1);
				break;
			}
		}
	}

	function modalCtrl($uibModalInstance, stock) {
		var vm = this;
		vm.modify = modify;
		vm.cancel = cancel;
		startModal();

		function startModal(){
			vm.stock = {};
			if(stock) {
				vm.stock = stock;
				vm.stock = {
					id: stock.id,
					sku: stock.sku,
					pic: stock.pic,
					name: stock.name,
					details: stock.details,
					price: parseFloat(stock.price),
					inStock: stock.inStock,
					status: stock.status
				};
			}
		}

		function modify(){
			$uibModalInstance.close(vm.stock)
		}

		function cancel(){
			$uibModalInstance.dismiss();
		}
	}
}