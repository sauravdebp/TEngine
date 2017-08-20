var TEngine = function () {
    function addArrayFeatures(TEngineDMobj) {
        TEngineDMobj["IsArray"] = true;
    }

    function createDataModel(dataObj) {
        var TEngineDM = function () {};
        var tEngineObject = new TEngineDM();

        var dataObjKeys = Object.keys(dataObj);
        for (var i = 0; i < dataObjKeys.length; i++) {
            var key = dataObjKeys[i];

            TEngineDM.prototype[key] = function (objKey, tEngineObject) {
                var dataObjVal = dataObj[objKey];

                tEngineObject.updateEvents = {};

                if (typeof dataObjVal == typeof {}) {
                    dataObjVal = createDataModel(dataObjVal);
                    var numObjectKeys = Object.keys(dataObj[objKey]).length;
                    dataObjVal["length"] = numObjectKeys;
                    if(Array.isArray(dataObj[objKey]))
                        addArrayFeatures(dataObjVal);
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
                        var updateEvents = dataObjVal.updateEvents;
                        dataObjVal = createDataModel(value);
                        dataObjVal["TEngineBindingContext"] = bindingContext;
                        dataObjVal["updateEvents"] = updateEvents;

                        var numObjectKeys = Object.keys(dataObj[objKey]).length;
                        dataObjVal["length"] = numObjectKeys;

                        if (Array.isArray(dataObj[objKey])) {
                            $(">:not(itemtemplate)", dataObjVal.TEngineBindingContext).remove();
                            addArrayFeatures(dataObjVal);
                        }
                        bindDataModel(dataObjVal, dataObjVal.TEngineBindingContext);
                    } else {
                        dataObj[objKey] = value;
                        bindValueToElems(getNextContextElem(objKey, tEngineObject.TEngineBindingContext), value);
                    }
                    
                    if(tEngineObject.updateEvents[objKey] != undefined)
                        tEngineObject.updateEvents[objKey](tEngineObject);
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

    function getItemTemplate(bindingPath, contextElem, isTemplateForArray) {
        var itemTemplateElem = $(">itemtemplate", contextElem);
        if(itemTemplateElem.length == 0) {
            var itemTemplateKey = $(contextElem).attr("template-key");
            itemTemplateElem = $("itemtemplate[key='" + itemTemplateKey + "']");
        }
        var itemTemplate = $($(itemTemplateElem).html());

        if ($(itemTemplate).attr("binding-path") != undefined) {
            if (isTemplateForArray)
                $(itemTemplate).attr("binding-path", bindingPath);
            else
                $(itemTemplate).removeAttr("binding-path");
        }
        else {
            if (isTemplateForArray)
                $("[binding-path='']", itemTemplate).first().attr("binding-path", bindingPath);
            else
                $("[binding-path='']", itemTemplate).first().removeAttr("binding-path");
        }

        $(contextElem).append(itemTemplate);
        return getNextContextElem(bindingPath, contextElem);
    }

    function bindDataModel(dataModel, contextElem) {
        var dataModelKeys = Object.keys(dataModel.__proto__);

        for (var i = 0; i < dataModelKeys.length; i++) {
            var dmKey = dataModelKeys[i];

            var nextContextElem = getNextContextElem(dmKey, contextElem);
            if ($(contextElem).attr("binding-path") != undefined &&
                ($(nextContextElem).length == 0 ||
                $(nextContextElem).parents("[binding-path]").first().attr("binding-path") != $(contextElem).attr("binding-path"))
            ) {
                nextContextElem = getItemTemplate(dmKey, contextElem, dataModel.IsArray);
            }

            if(nextContextElem.length == 0)
                continue;

            if (typeof dataModel[dmKey]() == typeof {}) {
                dataModel[dmKey]()["TEngineBindingContext"] = nextContextElem;
                bindDataModel(dataModel[dmKey](), nextContextElem);
            } else {
                bindValueToElems(nextContextElem, dataModel[dmKey](), dataModel[dmKey]);
            }
        }
    }

    function bindValueToElems(elems, value, dataModelAccessor) {
        for (var i = 0; i < $(elems).length; i++) {
            var elem = $(elems)[i];
            var outerHTML = $(elem).prop("outerHTML");
            var templateHTML = $(elem).prop("outerHTML");

            if (elem.TEngineElementTemplate != undefined){
                templateHTML = outerHTML = $(elem.TEngineElementTemplate).prop("outerHTML");
            }

            if (outerHTML.indexOf("{binding-path") == -1) {
                $(elem).text(value);
            } else {
                outerHTML = outerHTML.split("{binding-path}").join(value);
                var elemParent = $(elem).parent();
                $(elem).prop("outerHTML", $(outerHTML).attr("uniqueTempId", i).prop("outerHTML"));
                var tEngineDmObjCopy = elem.TEngineDMObject;
                elem = $("[uniqueTempId='" + i + "']", elemParent)[0];
                elem.TEngineDMObject = tEngineDmObjCopy;
                $(elem).removeAttr("uniqueTempId");
            }

            if (elem.TEngineElementTemplate == undefined) {
                elem.TEngineElementTemplate = $(templateHTML);
            }
            if (elem.TEngineDMObject == undefined) {
                elem.TEngineDMObject = dataModelAccessor;
            }

            setTargetToSourceBinding(elem, dataModelAccessor);
        }
    }

    function setTargetToSourceBinding(elem) {
        var updateEvents = 'change';
        if($(elem).attr("updateSourceEvents") != undefined)
            updateEvents = $(elem).attr("updateSourceEvents");
        if($(elem).attr("binding-mode") == "TwoWay") {
            $(elem).off(updateEvents).on(updateEvents, function() {
                var newValue = $(this).val();
                elem.TEngineDMObject(newValue);
            });
        }
    }

    return {
        createDataModel: createDataModel,
        bindDataModel: function (dataModel) {
            //hide all templates
            $("itemtemplate").css('display', 'none');

            bindDataModel(dataModel, $("body"));
        }
    }
}();