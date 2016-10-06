(function() {
  'use strict';

  angular
    .module('dhis2Webportal')
    .factory('chartService', chartService);

  /** @ngInject */
  function chartService($log, Restangular,urlService,$base64) {
    chartService.analyticsDataResponse = {};
    var chartsManager = {
        data: '',
        defaultChartObject: {
          title: {
            text: ''
          },
          xAxis: {
            categories: [],
            labels:{
              rotation: -90,
              style:{ 'color': '#000000', 'fontWeight': 'normal' }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: ''
            },labels:{
              style:{ 'color': '#000000', 'fontWeight': 'bold' }
            }
          },
          labels: {
            items: [{
              html: '',
              style: {
                left: '50px',
                top: '18px'
                //color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
              }
            }]
          },
          series: []
        }
    };

    var service = {
        getChartFavourites: getChartFavourites,
        getPivotFavourites: getPivotFavourites,
        getGisFavourites: getGisFavourites,
        getIcons: getIcons,
        getChartImage: getChartImage,
        getTitleIndex: getTitleIndex,
        getLabels: getLabels,
        getMetaData:  getMetaData,
        getValueIndex: getValueIndex,
        getMetadataArrayByType: getMetadataArrayByType,
        filterByCategoryType: filterByCategoryType,
        createSeries: createSeries,
        createBasicChart: createBasicChart,
        getAnalyticsFromReportTables: getAnalyticsFromReportTables,
        getAnalyticsObject: getAnalyticsObject,
        getDataDimensions: getDataDimensions,
        getAnalyticsPeriods: getAnalyticsPeriods,
        getAnalyticsOrganisationUnits: getAnalyticsOrganisationUnits,
        getSeriesDataValues: getSeriesDataValues,
        checkChart: checkChart,
        getChartIndex: getChartIndex
    };

    return service;

    function getChartFavourites(){
        return Restangular.one('charts').get({
            paging: 'false',
            fields: 'id,name,href,relativePeriods,filters,columns,rows,dataDimensionItems,periods,organisationUnits'
        }).then(function(data){
            return data;
        });
    }
    function getPivotFavourites(){
        return Restangular.one('reportTables').get({
            paging: 'false',
            fields: 'id,name,href,relativePeriods,filters,columns,rows,dataDimensionItems,periods,organisationUnits'
        }).then(function(data){
            return data;
        });
    }
    function getGisFavourites(){
        return Restangular.one('mapViews').get({
            paging: 'false',
            fields: 'id,name,href,relativePeriods,filters,columns,rows,dataDimensionItems,periods,organisationUnits'
        }).then(function(data){
            return data;
        });
    }

    function getIcons(icons){
        return icons;
    }

    function getChartImage(id){
        return urlService.chartUrlPng().one('charts',id).one('data').get({

        }).then(function(data){
          var chartImage = data;
            return chartImage;
        });
    }
    function getAnalyticsObject(dx,pe,ou){
        return Restangular.one('analytics').get({
            dimension: [ 'dx:' + dx, 'pe:' + pe ],
            filter: 'ou:' + ou
        }).then(function(data){
            return data;
        });
    }

    /**

    Fetch data dimensions into an array
    **/
    function getDataDimensions(objectValue){
        var dimension  = [];
        if(!angular.equals(objectValue,[])){
            angular.forEach(objectValue,function(obj){
                if(obj.dataDimensionItemType === 'DATA_ELEMENT'){
                    dimension.push(obj.dataElement.id);
                }
                else if(obj.dataDimensionItemType === 'INDICATOR'){
                    dimension.push(obj.indicator.id);
                }
                else if(obj.dataDimensionItemType === 'DATA_ELEMENT_OPERAND'){
                    dimension.push(obj.dataElementOperand.dataElement.id + '.' + obj.dataElementOperand.categoryOptionCombo.id);
                }
                else{
                    $log.info("Data dimension not supported");
                }
            });
        }
        return dimension;
    }
    /**
      Fetch periods from the analytics object
    **/
    function getAnalyticsPeriods(analyticsObject){
        var periods = [];
        if(angular.isDefined(analyticsObject)){
            if(angular.equals(analyticsObject.periods,[])){
                if(analyticsObject.relativePeriods.thisYear === true){
                    periods.push('THIS_YEAR');
                }
                else if(analyticsObject.relativePeriods.quartersLastYear === true){
                    periods.push('QUARTERS_LAST_YEAR');
                }
                else if(analyticsObject.relativePeriods.last52Weeks === true){
                    periods.push('LAST_52_WEEKS');
                }
                else if(analyticsObject.relativePeriods.thisWeek === true){
                    periods.push('THIS_WEEK');
                }
                else if(analyticsObject.relativePeriods.lastMonth === true){
                    periods.push('LAST_MONTH');
                }
                else if(analyticsObject.relativePeriods.monthsThisYear === true){
                    periods.push('MONTHS_THIS_YEAR');
                }
                else if(analyticsObject.relativePeriods.last2SixMonths === true){
                    periods.push('LAST_2_SIXMONTHS');
                }
                else if(analyticsObject.relativePeriods.thisQuarter === true){
                    periods.push('THIS_QUARTER');
                }
                else if(analyticsObject.relativePeriods.last12Months === true){
                    periods.push('LAST_12_MONTHS');
                }
                else if(analyticsObject.relativePeriods.last5FinancialYears === true){
                    periods.push('LAST_5_FINANCIALYEARS');
                }
                else if(analyticsObject.relativePeriods.thisSixMonth === true){
                    periods.push('THIS_SIXMONTH');
                }
                else if(analyticsObject.relativePeriods.lastQuarter === true){
                    periods.push('LAST_QUARTER');
                }
                else if(analyticsObject.relativePeriods.thisFinancialYear === true){
                    periods.push('THIS_FINANCIALYEAR');
                }
                else if(analyticsObject.relativePeriods.last4Weeks === true){
                    periods.push('LAST_4_WEEKS');
                }
                else if(analyticsObject.relativePeriods.last3Months === true){
                    periods.push('LAST_3_MONTHS');
                }
                else if(analyticsObject.relativePeriods.thisMonth === true){
                    periods.push('THIS_MONTH');
                }
                else if(analyticsObject.relativePeriods.last5Years === true){
                    periods.push('LAST_5_YEARS');
                }
                else if(analyticsObject.relativePeriods.last6BiMonths === true){
                    periods.push('LAST_6_BIMONTHS');
                }
                else if(analyticsObject.relativePeriods.lastFinancialYear === true){
                    periods.push('LAST_FINANCIALYEAR');
                }
                else if(analyticsObject.relativePeriods.last6Months === true){
                    periods.push('LAST_6_MONTHS');
                }
                else if(analyticsObject.relativePeriods.quartersThisYear === true){
                    periods.push('QUARTERS_THIS_YEAR');
                }
                else if(analyticsObject.relativePeriods.monthsLastYear === true){
                    periods.push('MONTHS_LAST_YEAR');
                }
                else if(analyticsObject.relativePeriods.lastWeek === true){
                    periods.push('LAST_WEEK');
                }
                else if(analyticsObject.relativePeriods.thisBimonth === true){
                    periods.push('THIS_BIMONTH');
                }
                else if(analyticsObject.relativePeriods.lastBimonth === true){
                    periods.push('LAST_BIMONTH');
                }
                else if(analyticsObject.relativePeriods.lastSixMonth === true){
                    periods.push('LAST_SIXMONTH');
                }
                else if(analyticsObject.relativePeriods.lastYear === true){
                    periods.push('LAST_YEAR');
                }
                else if(analyticsObject.relativePeriods.last12Weeks === true){
                    periods.push('LAST_12_WEEKS');
                }
                else if(analyticsObject.relativePeriods.last4Quarters === true){
                    periods.push('LAST_4_QUARTERS');
                }
                else{
                    $log.info("Relative period not supported yet");
                }
            }
            else{
                angular.forEach(analyticsObject.periods,function(period){
                    periods.push(period.id);
                });                
            }
        }
        return periods;
    }
    /**
      Fetch organisationUnits from the analytics object
    **/
    function getAnalyticsOrganisationUnits(analyticsObject){
        var organisationUnits = [];
        if(angular.isDefined(analyticsObject)){
            angular.forEach(analyticsObject,function(obj){
                if(angular.equals(obj,[])){
                    // Get organisation Unit groups
                }
                else{
                    organisationUnits.push(obj.id);
                }
            });
        }
        return organisationUnits;
    }
    function getAnalyticsFromReportTables(analyticsObject){
        
        var dx = '';
        if(angular.isDefined(analyticsObject)){
            //if(objectValue.columns === 'dx'){ // TO DO, check for multiple columns
            var dxArray = getDataDimensions(analyticsObject.dataDimensionItems);
            dx = dxArray.join(';');
            //}
            var pe = getAnalyticsPeriods(analyticsObject);
            pe = pe.join(';');
            var ou = getAnalyticsOrganisationUnits(analyticsObject.organisationUnits);
            ou = ou.join(';');
            return getAnalyticsObject(dx,pe,ou).then(function(analyticsData){
                chartService.analyticsDataResponse = analyticsData;
              return chartService.analyticsDataResponse;
            });
        }
        //return analyticsResponse;
    }
    /**
     Get metadata from analytics object
      - names === metaData.names
      - dx === metaData.dx
      - ou === metaData.ou
      - co === metaData.co
      - pe === metaData.pe
    **/
    function getMetaData(analyticsObject){
        if(angular.isDefined(analyticsObject)){
            return analyticsObject.metaData;
        }
        else{
           $log.info("Analytics object is not defined");
        }
    }

    /**
      Get Label names from metaData.names using dx,co,pe,ou arrays
    **/
    function getLabels(metadataArray,dimensions){

        var labels = [];
       
        if(!angular.equals(dimensions,[])){
            angular.forEach(dimensions,function(dim){
                var label = {};
                if(angular.equals(metadataArray,[]) !== true){
                    angular.forEach(metadataArray,function(metadata){
                        if(metadata.indexOf(dim) > -1){
                            label.uid = metadata;
                            label.name = (metadata.split('"'))[1];
                            labels.push(label);
                        }
                    });
                }
            });
        }
        return labels;
    }
    /** 
     ** Thanks for Kevin - HISP Tanzania for these three following functions below 
     **/
    //determine the position of metadata using prefix [dx,de,co,pe,ou]
    function getTitleIndex(analyticsObjectHeaders,name){
        var index = 0;
        var counter = 0;
        angular.forEach(analyticsObjectHeaders,function(header){
            if(header.name === name){
                index = counter;
            }
            counter++;
        });
        return index;
    }

    //determine the position of data value,(Expected to be the last one)
    function getValueIndex(analyticsObjectHeaders){
        var counter = analyticsObjectHeaders.headers;
        return ((counter.length) - 1);
    }

    //get an array of items from analyticsObject[metadataType == dx,co,ou,pe,value]
    function getMetadataArrayByType(analyticsObject, metadataType) {
        var metadataArray = [];
        if(angular.isDefined(analyticsObject)){
            if(metadataType === 'dx'){
                metadataArray = analyticsObject.dx;
            }
            else if(metadataType === 'ou'){
                metadataArray = analyticsObject.ou;
            }
            else if(metadataType === 'co'){
                metadataArray = analyticsObject.co;
            }
            else if(metadataType === 'pe'){
                metadataArray = analyticsObject.pe;
            }
            else{
                metadataArray = analyticsObject[metadataType];
            }
        }
        return metadataArray;
    }
    
    /**
      Expected data for highcharts
      categories : default is pe array
      y- Axis : data
       series : Data Elements, Indicators,etc is multi array
    **/
    /**
      Filter by category e.g pe,ou,dx
      analyticsObject = analtyics rows

    **/
    function filterByCategoryType(analyticsObject,typeUid,position){
        if(angular.equals(analyticsObject,[]) !== true){
            return analyticsObject.filter(function(val){
                return val[position] === typeUid;
            });

        }
    }

    /**
      TO DO
      Arrange series data in the same order as categories (highcharts)

    **/
   
    function getSeriesDataValues(filteredCategoryData,position){
        var values = [];
        if(!angular.equals(filteredCategoryData,[])){
            angular.forEach(filteredCategoryData,function(val){
                var num = parseFloat(val[position]).toFixed(1);

                values.push(num);
            });
        }
        return values;
    }

    /**
     Create series for data based on filtered categories
    **/

    function createSeries(analyticsObject){
        var series = [];
        var analyticsMetadata = getMetaData(analyticsObject);
        var analyticsCategory = getMetadataArrayByType(analyticsMetadata,'dx');
        var analyticsCategoryNames = getMetadataArrayByType(analyticsMetadata,'names');
        var position = getTitleIndex(analyticsObject.headers,'dx');
        var valPosition = getValueIndex(analyticsObject);

        if(angular.equals(analyticsCategory,[]) !== true){
            angular.forEach(analyticsCategory,function(category){  
                var seriesValue = {};              
                var filteredCategory = filterByCategoryType(analyticsObject.rows,category,position);                
                var filteredCategorySorted = filteredCategory.sort();
                seriesValue.name = analyticsCategoryNames[category];
                var seriesData = getSeriesDataValues(filteredCategorySorted,valPosition);
                seriesValue.data = seriesData.map(Number);
                series.push(seriesValue);
            });
        }
        //$log.info("Series " + angular.toJson(series));
        return series;
    }

    /**
      Create Basic charts
      arguments:
    **/
    function createBasicChart(analyticsObject,chartType){
        var chartObject = angular.copy(chartsManager);
        var analyticsMetadata = getMetaData(analyticsObject);
        chartObject.defaultChartObject.xAxis.categories =  getMetadataArrayByType(analyticsMetadata,'pe');
        chartObject.defaultChartObject.series = createSeries(analyticsObject);
        return chartObject;
    }
    /**

    Check if chart exists and has been drawn
    **/
    function checkChart(charts,chartObject){
        var chartExists = false;
        if(angular.isDefined(charts) && (!angular.equals(charts,[]))){
            angular.forEach(charts,function(chart){
                if(chart.id === chartObject.id){
                   chartExists = true;
                   return;
                }
            });
        }
        return chartExists;
    }
    /**
        Get chart position from the current drawable configuration
    **/
    function getChartIndex(charts,id){
        var chartIndex = 0;
        if(angular.isDefined(charts) && (!angular.equals(charts,[]))){
            angular.forEach(charts,function(chart,index){
                if(chart.id === id){
                   chartIndex = index ;
                   return;
                }
            });
        }
        return chartIndex;
    }

  }
})();
