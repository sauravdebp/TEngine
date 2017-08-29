function fetchMarketData() {
    $.ajax({
        url: "https://www.alphavantage.co/query?function=SECTOR&apikey=8T0R4KFXPWGBWIKW",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            dataModel = {
                performanceData: []
            }

            var periodicities = Object.keys(data);
            for(var i = 1; i < periodicities.length; i++) {
                var sectorsPerformance = {
                    periodicity: periodicities[i],
                    marketSectors: []
                }
                var markets = Object.keys(data[periodicities[i]]);
                for(var j = 0; j < markets.length; j++) {
                    sectorsPerformance.marketSectors.push({
                        marketSector: markets[j],
                        marketSectorPerformance: data[periodicities[i]][markets[j]]
                    });
                }

                dataModel.performanceData.push(sectorsPerformance);
            }

            dataReady(dataModel);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
}

function dataReady(dataModel) {
    bm = TEngine.createBindingModel(dataModel);
    TEngine.bindModel(bm);
}

$(document).ready(function() {
    TEngine.init();
    TEngine.converters = {
        getPerformanceClass: function(performanceValue) {
            var perf = parseFloat(performanceValue.replace("%", ""));
            if(perf < 0)
                return "NegativePerf";
            return "PositivePerf";
        }
    }
    fetchMarketData();
});