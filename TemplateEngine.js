var TEngine = function () {
    function createDataModel(dataObj) {
        var TEngineDM = function () {};
        var tEngineObject = new TEngineDM();

        var dataObjKeys = Object.keys(dataObj);
        for (var i = 0; i < dataObjKeys.length; i++) {
            var key = dataObjKeys[i];

            TEngineDM.prototype[key] = function (objKey, tEngineObject) {
                var dataObjVal = dataObj[objKey];

                if (typeof dataObjVal == typeof {}) {
                    dataObjVal = createDataModel(dataObjVal);
                    var numObjectKeys = Object.keys(dataObj[objKey]).length;
                    dataObjVal["length"] = numObjectKeys;
                }

                return function (value) {
                    if (value == undefined) {
                        if (typeof dataObjVal == typeof {})
                            return dataObjVal;
                        return dataObj[objKey];
                    }

                    if (typeof dataObjVal == typeof {}) {
                        dataObj[objKey] = value;
                        var bindingContext = dataObjVal.TEngineBindingContext;
                        dataObjVal = createDataModel(value);
                        dataObjVal["TEngineBindingContext"] = bindingContext;
                        var numObjectKeys = Object.keys(dataObj[objKey]).length;
                        dataObjVal["length"] = numObjectKeys;

                        if (Array.isArray(dataObj[objKey]))
                            $(">:not(itemtemplate)", dataObjVal.TEngineBindingContext).remove();
                        bindDataModel(dataObjVal, dataObjVal.TEngineBindingContext);
                    } else {
                        dataObj[objKey] = value;
                        bindValueToElems(getNextContextElem(objKey, tEngineObject.TEngineBindingContext), value);
                    }
                };
            }(key, tEngineObject);
        }
        return tEngineObject;
    }

    function getNextContextElem(bindingPath, contextElem) {
        var possibleNextElems = $("[binding-path='" + bindingPath + "']", contextElem);
        if (possibleNextElems.length <= 1)
            return possibleNextElems;

        var nextContextElems = [];
        for (var i = 0; i < possibleNextElems.length; i++) {
            var elem = possibleNextElems[i];
            var elemParents = $(elem).parents("[binding-path]");
            if ($(elemParents[0]).attr("binding-path") == $(contextElem).attr("binding-path"))
                nextContextElems.push(elem);
        }

        return nextContextElems;
    }

    function bindDataModel(dataModel, contextElem) {
        var dataModelKeys = Object.keys(dataModel.__proto__);

        for (var i = 0; i < dataModelKeys.length; i++) {
            var dmKey = dataModelKeys[i];

            var nextContextElem = getNextContextElem(dmKey, contextElem);
            if ($(nextContextElem).length == 0 ||
                $(nextContextElem).parents("[binding-path]").first().attr("binding-path") != $(contextElem).attr("binding-path")
            ) {
                var itemTemplate = $(">itemtemplate", contextElem).css('display', 'none');
                nextContextElem = $($(itemTemplate).html());

                if ($(nextContextElem).attr("binding-path") != undefined)
                    $(nextContextElem).attr("binding-path", dmKey);
                else
                    $("[binding-path='']", nextContextElem).first().attr("binding-path", dmKey);
                $(contextElem).append(nextContextElem);
                nextContextElem = getNextContextElem(dmKey, contextElem);
            }

            if (typeof dataModel[dmKey]() == typeof {}) {
                dataModel[dmKey]()["TEngineBindingContext"] = nextContextElem;
                bindDataModel(dataModel[dmKey](), nextContextElem);
            } else {
                bindValueToElems(nextContextElem, dataModel[dmKey]());
            }
        }
    }

    function bindValueToElems(elems, value) {
        for (var i = 0; i < $(elems).length; i++) {
            var elem = $(elems)[i];
            var outerHTML = $(elem).prop("outerHTML");

            if (outerHTML.indexOf("{binding-path") == -1) {
                $(elem).text(value);
            } else {
                outerHTML = outerHTML.split("{binding-path}").join(value);
                $(elem).prop("outerHTML", outerHTML);
            }
        }
    }

    return {
        createDataModel: createDataModel,
        bindDataModel: function (dataModel) {
            bindDataModel(dataModel, $("body"));
        }
    }
}();