var menuStructure = {
    menuItems: [
        {
            menuItem: "Search",
            menuItems: [
                {
                    menuItem: "Securities"
                },
                {
                    menuItem: "Entities"
                }
            ]
        },
        {
            menuItem: "Configure",
            menuItems: [
                {
                    menuItem: "Security Types",
                    menuItems: [
                        {
                            menuItem: "Configure Security Types"
                        },
                        {
                            menuItem: "Data Source Configurations"
                        }
                    ]
                },
                {
                    menuItem: "Reference Types",
                    menuItems: [
                        {
                            menuItem: "Entity Type Modeller"
                        },
                        {
                            menuItem: "Configure Data Sources"
                        }
                    ]
                }
            ]
        }
    ]
}

TEngine.init();
var dm = TEngine.createBindingModel(menuStructure);
TEngine.bindModel(dm);

function customBinderFunction(tEngineObj, tEngineObjTarget) {
    console.log("CLICKED");
}