var data = 
{
    // EmpName: "Saurav",
    // EmpAge: "24"
    Employees: [
        {
            EmpName: "Person A",
            EmpAge: 0,
            Dependants: ["Dependant AA", "Dependant AB"],
            Test: {
                EmpName: "TEST A"
            }
        },
        {
            EmpName: "Person B",
            EmpAge: 0,
            Dependants: ["Dependant BA", "Dependant BB"],
            Test: {
                EmpName: "TEST B"
            }
        },
        {
            EmpName: "Person C",
            EmpAge: 0,
            Dependants: ["Dependant CA", "Dependant CB"],
            Test: {
                EmpName: "TEST C"
            }
        },
        {
            EmpName: "Person D",
            EmpAge: 0,
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
TEngine.bindDataModel(dm);

function Test1() {
    var newRanking = null;

    for(var i = 0; i < dm.Employees().length; i++) {
        var emp = dm.Employees()[i]();
        var incr = (Math.floor(Math.random() * 10)) % 3;
        emp.EmpAge(emp.EmpAge() + incr);

        if(emp.EmpAge() > 500)
        {
            newRanking = data.Employees.sort(function (emp1, emp2) { return emp1.EmpAge < emp2.EmpAge });
            newRanking.pop(newRanking[newRanking.length - 1]);

            if(data.Employees.length > 1)
            {
                data.Employees.forEach(function (emp) { emp.EmpAge = 0; });
                break;
            }
            return;
        }
    }

    if (newRanking == null)
        newRanking = data.Employees.sort(function (emp1, emp2) { return emp1.EmpAge < emp2.EmpAge });
    dm.Employees(newRanking);
    dm.WinningEmployee(data.Employees[0]);

    setTimeout(Test1, 3000);
}

// Test1();