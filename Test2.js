var data = {
    n1: 0,
    n2: 0,
    answer: 0
};

var dataModel = TEngine.createDataModel(data);

dataModel.updateEvents.n1 = dataModel.updateEvents.n2 = function() {
    dataModel.answer(Math.pow(data.n1, data.n2));
};

TEngine.bindDataModel(dataModel);