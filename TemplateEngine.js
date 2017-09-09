var TEngine = function () {
    function addArrayFeatures(TEngineDMobj, dataArr) {
        TEngineDMobj["IsArray"] = true;
        TEngineDMobj["sort"] = function(comparer) {
            //TODO: Bubble sort is temporary. Implement better sorting.
            for(var i = 0; i < this.length; i++) {
                for(var j = 0; j < this.length - i - 1; j++) {
                    if(comparer(this[j](), this[j + 1]())) {
                        var temp = this[j];
                        this[j] = this[j + 1];
                        this[j + 1] = temp;

                        temp = dataArr[j];
                        dataArr[j] = dataArr[j + 1];
                        dataArr[j + 1] = temp;
                    }
                }
            }

            bindModel(this, this.TEngineBindingContext);
        }
    }

    function createBindingModel(dataObj) {
        var TEngineDM = function () {};
        var tEngineObject = new TEngineDM();

        if(dataObj == null || dataObj == undefined)
            return null;
        var dataObjKeys = Object.keys(dataObj);
        for (var i = 0; i < dataObjKeys.length; i++) {
            var key = dataObjKeys[i];

            TEngineDM.prototype[key] = function (objKey, tEngineObject) {
                var dataObjVal = dataObj[objKey];

                tEngineObject.updateEvents = {};

                if (typeof dataObjVal == typeof {}) {
                    dataObjVal = createBindingModel(dataObjVal);
                    if(dataObjVal != null) {
                        var numObjectKeys = Object.keys(dataObj[objKey]).length;
                        dataObjVal["length"] = numObjectKeys;
                    }
                    if(Array.isArray(dataObj[objKey]))
                        addArrayFeatures(dataObjVal, dataObj[objKey]);
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
                        dataObjVal = createBindingModel(value);
                        if(dataObjVal == null)
                            return;
                        dataObjVal["TEngineBindingContext"] = bindingContext;
                        dataObjVal["updateEvents"] = updateEvents;

                        var numObjectKeys = Object.keys(dataObj[objKey]).length;
                        dataObjVal["length"] = numObjectKeys;

                        if (Array.isArray(dataObj[objKey])) {
                            $(">:not(itemtemplate)", dataObjVal.TEngineBindingContext).remove();
                            addArrayFeatures(dataObjVal, dataObj[objKey]);
                        }
                        bindModel(dataObjVal, dataObjVal.TEngineBindingContext);
                    } else {
                        dataObj[objKey] = value;
                        bindValueToElems(getNextContextElem(objKey, tEngineObject.TEngineBindingContext), value, tEngineObject[objKey]);
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

        var nextContextElems = [];
        for (var i = 0; i < possibleNextElems.length; i++) {
            var elem = possibleNextElems[i];
            var elemParents = $(elem).parents("[binding-path]");
            if (
                elemParents.length == 0 ||
                elemParents[0] == contextElem ||
                (Array.isArray(contextElem) && contextElem.indexOf(elemParents[0]) != -1)
            ) nextContextElems.push(elem);
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

    function bindModel(dataModel, contextElem) {
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

            if (typeof dataModel[dmKey]() == typeof {} && dataModel[dmKey]() != null) {
                dataModel[dmKey]()["TEngineBindingContext"] = nextContextElem;
                bindModel(dataModel[dmKey](), nextContextElem);
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

            if (outerHTML.indexOf("{binding-path}") == -1) {
                $(elem).text(value);
            } else {
                outerHTML = outerHTML.split("{binding-path}").join(value);
                elem = setElemBindedHTML(elem, outerHTML);
            }

            if($(outerHTML).attr("value-converter") != undefined) {
                var valueConverterNS = $(outerHTML).attr("value-converter");
                var regexp = new RegExp('{' + valueConverterNS + '\\.[a-zA-Z_]+\\(.+\\)}', 'gi');
                
                var result;
                var regStr = outerHTML;
                while ( (result = regexp.exec(regStr)) ) {
                    var jsExp = result[0].substr(1, result[0].length - 2);
                    var expVal = eval("TEngine." + jsExp);

                    outerHTML = outerHTML.replace(result[0], expVal);
                }

                elem = setElemBindedHTML(elem, outerHTML);
            }

            if (elem.TEngineElementTemplate == undefined) {
                elem.TEngineElementTemplate = $(templateHTML);
            }
            if (elem.TEngineDMObject == undefined) {
                elem.TEngineDMObject = dataModelAccessor;
            }
            else if(elem.TEngineDMObject != dataModelAccessor && dataModelAccessor != undefined)
                elem.TEngineDMObject = dataModelAccessor;

            setTargetToSourceBinding(elem, dataModelAccessor);
        }
    }

    function setElemBindedHTML(elem, html) {
        var elemParent = $(elem).parent();
        var uniqueId = Math.ceil(Math.random() * 1000);
        $(elem).prop("outerHTML", $(html).attr("uniqueTempId", uniqueId).prop("outerHTML"));
        var tEngineDmObjCopy = elem.TEngineDMObject;
        elem = $("[uniqueTempId='" + uniqueId + "']", elemParent)[0];
        elem.TEngineDMObject = tEngineDmObjCopy;
        $(elem).removeAttr("uniqueTempId");

        return elem;
    }

    function setTargetToSourceBinding(elem) {
        var bindingMode = $(elem).attr("binding-mode");
        if(bindingMode == "TwoWay" || bindingMode == "OneWayToSource") {
            var updateEvents = 'change';
            if($(elem).attr("updateSourceEvents") != undefined)
                updateEvents = $(elem).attr("updateSourceEvents");
            var sourceBindingHandler = getSourceBindingHandler(elem);

            $(elem).off(updateEvents).on(updateEvents, sourceBindingHandler);
        }
    }

    function getSourceBindingHandler(elem) {
        var sourceBindingHandler = function() {
            var newValue = $(this).val();
            elem.TEngineDMObject(newValue);
        }

        var customSourceBindingHandler = $(elem).attr("sourceBindingHandler");
        if(customSourceBindingHandler != null && customSourceBindingHandler != undefined) {
            sourceBindingHandler = function() {
                var tEngineObj = elem.TEngineDMObject;
                eval(customSourceBindingHandler + "(tEngineObj);");
            }
        }

        return sourceBindingHandler;
    }

    function importTemplates(context, onImportComplete) {
        var templates = $("script[template-alias]", context);
        for(var i = 0; i < templates.length; i++) {
            var template = templates[i];
            var templateAlias = $(template).attr("template-alias");
            var templateSrc = $(template).attr("src");
            
            $.ajax({
                async: false,
                url: templateSrc,
                success: function(data, textStatus, jqXHR) {
                    var templateContainer = $("<itemtemplate>").attr("key", templateAlias);
                    $(templateContainer).html(data);
                    $(context).append(templateContainer);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + "||" + errorThrown);
                }
            });
        }
    }

    return {
        init: function() {
            $("itemtemplate").css('display', 'none');
            importTemplates($("body"));
        },
        createBindingModel: createBindingModel,
        bindModel: function (dataModel) {
            //hide all templates
            $("itemtemplate").css('display', 'none');

            bindModel(dataModel, $("body"));
        }
    }
}();