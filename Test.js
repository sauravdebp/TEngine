var data = 
{
    // EmpName: "Saurav",
    // EmpAge: "24"
    Employees: [
        {
            EmpName: "Person A",
            EmpAge: 4,
            Dependants: ["Dependant AA", "Dependant AB"],
            Test: {
                EmpName: "TEST A"
            }
        },
        {
            EmpName: "Person B",
            EmpAge: 2,
            Dependants: ["Dependant BA", "Dependant BB"],
            Test: {
                EmpName: "TEST B"
            }
        },
        {
            EmpName: "Person C",
            EmpAge: 1,
            Dependants: ["Dependant CA", "Dependant CB"],
            Test: {
                EmpName: "TEST C"
            }
        },
        {
            EmpName: "Person D",
            EmpAge: 3,
            Dependants: ["Dependant DA", "Dependant DB"],
            Test: {
                EmpName: "TEST D"
            }
        }
    ],
    WinningEmployee: {},
    TestArray: [1, 2, 3]
};

var dm = TEngine.createDataModel(data);

for(var i = 0; i < data.Employees.length; i++) {
    dm.Employees()[i]().updateEvents.EmpAge = onEmployeeAgeChanged;
}

function onEmployeeAgeChanged(employee) {
    dm.Employees().sort(function (emp1, emp2) { return parseInt(emp1.EmpAge()) < parseInt(emp2.EmpAge()) });
    dm.WinningEmployee(data.Employees[0]);
}
dm.WinningEmployee(data.Employees[0]);
TEngine.bindDataModel(dm);



function Test1() {
    for(var i = 0; i < dm.Employees().length; i++) {
        var emp = dm.Employees()[i]();
        var incr = (Math.floor(Math.random() * 10)) % 3;
        emp.EmpAge(emp.EmpAge() + incr);
    }
    dm.WinningEmployee(data.Employees[0]);

    if(dm.WinningEmployee().EmpAge() < 100)
        setTimeout(Test1, 100);
}

// Test1();