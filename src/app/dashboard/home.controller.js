(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($log,$timeout, webDevTec, toastr,userService,chartService,$rootScope) {
    var vm = this;

    vm.awesomeThings = [];
    vm.pivotFavourites = [];
    vm.chartFavourites = [];
    vm.gisFavourites = [];
    vm.classAnimation = '';
    vm.creationDate = 1474958093575;
    vm.baseurl = $rootScope.loginUrl;
    vm.selectedChartFavourite = {};
    vm.selectedPivotFavourite = {};
    vm.selectedGisFavourite = {};
    vm.type = '';

    vm.getChartType = getChartType;
    vm.getAnalyticsData = getAnalyticsData;
    vm.drawChart = drawChart;
    vm.getSelectedItems = getSelectedItems;

    vm.analyticsValue = vm.selectedChartFavourite; // This expected to be an array of objects to be printed per page
    vm.icons = [
                {name:'table',image:'table.jpg',action:''},
                {name:'column',image:'bar.png',action:''},
                {name:'line',image:'line.png',action:''},
                {name:'combined',image:'combined.jpg',action:''},
                {name:'bar',image:'column.png',action:''},
                {name:'area',image:'area.jpg',action:''},
                {name:'pie',image:'pie.png',action:''},
                {name:'map',image:'map.jpg',action:''}
            ];
    //vm.showToastr = showToastr;
    //This is not a highcharts object. It just looks a little like one!
    vm.chartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                type: '',
                spacingBottom: 15,
                spacingTop: 10,
                spacingLeft: 10,
                spacingRight: 10
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                currentMin: 0,
                currentMax: 20,
                title: {text: 'Periods'}
            }
        },
        //The below properties are watched separately for changes.

        series: [],
        title: {
            text: ''
        },
        loading: false,

        useHighStocks: false
        //function (optional)
        //func: function (chart) {
         //setup some logic for the chart
        //}
    };
    vm.chartConfig.options.chart.type = vm.type;
    vm.charts = [];
    vm.chartsConfigs = [];


    activate();

    function activate() {
      getWebDevTec();
      userService.getUserDetails();
      getChartFavourites();
      getPivotFavourites();
      getGisFavourites();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
        //selectedCharts();
      }, 4000);

    }
    /*
    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }
    */
    function getSelectedItems(item){
        vm.newChart = item;
        var existingChart = chartService.checkChart(vm.charts,item);
        if(existingChart === false){
            vm.charts.push(item);
            selectedCharts();        
        }
        else{
            toastr.info("The item already exists on the portal");
        }
        return vm.charts;
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
    function getChartFavourites() {
        return chartService.getChartFavourites().then(function(data) {
            vm.chartFavourites = data.charts;
            //vm.selectedChartFavourite = vm.chartFavourites[0];
            //vm.charts.push(vm.chartFavourites[1]);
            getSelectedItems(vm.chartFavourites[0]);
            return vm.chartFavourites;  
        });
    }
    function getPivotFavourites() {
        return chartService.getPivotFavourites().then(function(data) {
            vm.pivotFavourites = data.reportTables;
            //vm.selectedPivotFavourite = vm.pivotFavourites[0];
            getSelectedItems(vm.pivotFavourites[0]);
            return vm.pivotFavourites;  
        });
    }
    function getGisFavourites() {
        return chartService.getGisFavourites().then(function(data) {
            vm.gisFavourites = data.mapViews;
            //vm.selectedGisFavourite = vm.gisFavourites[0];
            return vm.gisFavourites;  
        });
    }
    function getChartType(type,id){
        vm.type = type;        
        vm.index = chartService.getChartIndex(vm.chartsConfigs,id);
        vm.chartsConfigs[vm.index].config.options.chart.type = vm.type;
        vm.chartsConfigs[vm.index] = angular.copy(vm.chartsConfigs[vm.index]);
        return vm.chartsConfigs;
    }
    function getAnalyticsData(){
        vm.analyticsObjectData = {};
        return chartService.getAnalyticsFromReportTables(vm.analyticsValue).then(function(data){
            vm.analyticsObjectData = data;
            
            return drawChart();
        });
    }
    function drawChart(){
        vm.chartObject = {};
        vm.chartdata = {};
        vm.chartdata = chartService.createBasicChart(vm.analyticsObjectData,vm.type);
  
        vm.chartCopy = angular.copy(vm.chartsConfigs);        
        vm.chartConfig.series = vm.chartdata.defaultChartObject.series;
        vm.chartConfig.options.xAxis.categories = vm.chartdata.defaultChartObject.xAxis.categories;
        vm.chartObject.name = vm.analyticsValue.name;
        vm.chartObject.id = vm.analyticsValue.id;
        vm.chartObject.config = vm.chartConfig;
      
        vm.chartCopy.push(vm.chartObject);

        return vm.chartCopy;
    }
    function selectedCharts(){
        vm.analyticsValue = {};
        vm.analyticsValue = vm.newChart;
        getAnalyticsData().then(function(cht){
            vm.chartsConfigs = cht;
        });        
    }
  }
})();
