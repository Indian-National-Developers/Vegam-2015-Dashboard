// Global vars
studentList             =   null;
schoolObject            =   null;
isPopulating            =   true;
lindex                  =   1;
index                   =   1;

// Angular Controller (for row repetition)
var myApp = angular.module('rowRepeaterApp', []);
myApp.controller('repeaterController', ['$scope', function ($scope) {

}]);

// Parse framework Initialization
//2k15
//Parse.initialize("BlYcmQmAAvCsDdanA7TJh14KiHrCCqb3z5vPz1Ay", "ovGdJ7e9MJ0wqqcsadYauC9t5aiXvluiuqBrvf3x");

    //2K16
    Parse.initialize("xDSozIKPzcsfEtMJSUpqh88nIJ8gyBZOFpmJIjn0", "rqLvdUmxNKcm8o6tLv9aSCabWHxoi4p6ziJ8wDog");

// On document ready
$( document ).ready(function() {

    // float the save, logoout, generate buttons to appear always
    var edge = ($(window).width() - ($('#studTable').offset().left + $('#studTabe').outerWidth()));
    $('#saveButton').css({left: edge});
    $('#logoutButton').css({left: edge});
    $('#generateButton').css({left: edge});

    loadSchoolFromParse();

    /**
     * Control Handlers
     */

    // delete student button handler
    $("[id^=deleteStudButton]").click(function() {
        var index       =   parseInt($(this).attr("id").replace('deleteStudButton',''), 10);
        var rollNo      =   $('#rollNumberField' + index).val();

        showOverlayOnRowIndex(index);

        var studClass   =   Parse.Object.extend("Student");
        var query       =   new Parse.Query(studClass);
        query.equalTo("ROLLNUMBER", rollNo);
        query.equalTo("school", schoolObject);
        query.first({
            success:function(studObj) {
                console.log(studObj);
                studObj.destroy({
                    success: function(myObject) {
                        $divOverlay.fadeOut();
                        $('#userNameField' + index).val(""); 
                        $('#rollNumberField' + index).val(""); 
                        location.reload();
                    },
                    error: function(myObject, error) {
                    }
                });
            },
            error: function(studerror) {
            }
        });
    });

    $("[id^=ageField]").blur(function() {
        var index       =   parseInt($(this).attr("id").replace('ageField',''), 10);
        var enteredValue=   parseInt($(this).val());

        if (enteredValue < 6 || enteredValue > 25) {
            alert('Age should be given between 6 and 25 at row number ' + (index + 0));
            $(this).val('12');
        }

    });

    $(document.body).on("change",":checkbox", function() {
        var parentObj           =   $(this).parent();
        var checkedBoxes        =   parentObj.find(":checked")
        if (checkedBoxes.length >= 3) {
            alert ('A student can participate in a maximum of 2 events');
            $(this).prop('checked', false);
        }
    });

});

function showOverlayOnRowIndex(rowIndex) {

    $divOverlay             =   $("#rowOverlay");
    $rowOverlay             =   $("#stuRow" + rowIndex);
    var rowTop              =   $rowOverlay.position().top;
    var rowLeft             =   $rowOverlay.position().left;
    var rowWidth            =   $rowOverlay.css('width');
    var rowHeight           =   $rowOverlay.css('height');
    $divOverlay.css({
        position            :   'absolute',
        top                 :   rowTop,
        left                :   rowLeft,
        width               :   rowWidth,
        height              :   rowHeight
    });
    $divOverlay.show();

}

function loadSchoolFromParse() {
    console.log(sessionStorage);
    var schoolClass     =   Parse.Object.extend("User");
    var squery          =   new Parse.Query(schoolClass);
    squery.get(sessionStorage.school, {
        success:function(sobj) {
            var stuClass=   Parse.Object.extend("Student");
            //var s       =   new stuClass();
            var stQuery =   new Parse.Query(stuClass);
            //schoolObject=   sobj;
            console.log(sobj.attributes);
            stQuery.equalTo("school", sobj);
            stQuery.ascending("no");
            //stQuery.limit(1000);
            //console.log(stQuery);
            stQuery.find({
                success:function(students) {
                    studentList =   students;
                    //console.log(students);
                    lindex = 1;
                    console.log("isPopulating");
                    if (students.length){
                        populateFields();
                        console.log("Populated");
                    }
                }, error:function(stobj, sterr) {
                    console.log('Error fetching student' + sterr.message);
                }
            });
        }, error:function(sobj, serr) {
            console.log('Error fetching school' + serr.message);
        }
    });

}

function populateFields() {
    var students = studentList;
    var i = lindex-1;
    var index       =   i+1;
    var categ       =   students[i].get('CATEGORY');
    $('#userNameField' + index).val(students[i].get('USERNAME'));
    $('#rollNumberField' + index).val(students[i].get('ROLLNUMBER'));
    $('#ageField' + index).val(students[i].get('AGE'));
    $('#sexCombo' + index).val(students[i].get('GENDER'));
    $('#categoryCombo' + index).val(categ);
    $('#MRLevel' + index).hide();
    if (categ == 'MR') {
        $('#MRLevel' + index).val(students[i].get('LEVEL'));
        $('#MRLevel' + index).show();
    } else if (categ == 'VI') {
        $('#VILevel' + index).val(students[i].get('LEVEL'));
        $('#VILevel' + index).show();
    }
    isPopulating    =   true;
    getEvents(index);
    lindex++;

    if (lindex <= students.length ) {
        setTimeout(populateFields(), 1000);
    }
}

function getEvents(rowIndex) {

    var container           =   document.getElementById('eventRow'+rowIndex);

    showOverlayOnRowIndex(rowIndex);

    var eventsClass         =   Parse.Object.extend("EVENTS");
    var query               =   new Parse.Query(eventsClass);

    var sexValue            =   $('#sexCombo' + rowIndex).val();
    var ageValue            =   parseInt($('#ageField' + rowIndex).val());
    var categoryValue       =   $('#categoryCombo' + rowIndex).val();

    query.equalTo("GENDER", sexValue);
    query.lessThanOrEqualTo("AGE_MIN", ageValue);
    query.greaterThanOrEqualTo("AGE_MAX", ageValue);;
    query.equalTo("D_Category", categoryValue); 

    if(categoryValue == "MR") {
        var levelValue      =   parseInt($('#MRLevel' + rowIndex).val());
        query.equalTo("D_Level_1_2_3", levelValue);
    } else if (categoryValue == "VI") {
        var levelValue      =   parseInt($('#VILevel' + rowIndex).val());
        query.equalTo("D_Level_1_2_3", levelValue);
    }

    query.find({
        success:function(results) {
            //empty the event cell for the given row
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }

            populateEventCellWithEvents(results, rowIndex);
            $divOverlay.fadeOut();
        }, 
        error: function(error) {
            console.log('Failure retrieveing events' + error.message );
        }
    });
}

function populateEventCellWithEvents(events, rowIndex) {
    var container           =   document.getElementById('eventRow'+rowIndex);
    events.forEach(function(event) {
        //console.log(event.id);
        var checkbox        =   document.createElement('input');
        checkbox.type       =   "checkbox";
        checkbox.id         =   event.id;

        var label           =   document.createElement('label')
        label.htmlFor       =   event.id;
        label.appendChild(document.createTextNode(event.get('EVENT_NAME')));

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(document.createElement('br'));

        if(isPopulating && studentList[rowIndex-1]) {
            var event1Obj = studentList[rowIndex-1].get('event1');
            if (event1Obj && event1Obj.id == event.id) {
                checkbox.checked = true;
            }
            var event2Obj = studentList[rowIndex-1].get('event2');
            if (event2Obj && event2Obj.id == event.id) {
                checkbox.checked = true;
            }
        }
    });

};

function checkForDuplicateAndSave() {
    var rollArray           =   [];
    var duplicate           =   false;
    for(var i = 1; i <= 99; i++) {
        var currentRoll     =   $('#rollNumberField' + i).val();
        if (currentRoll == "") continue;
        var inde            =   rollArray.indexOf(currentRoll);
        if (inde != -1) {
            duplicate       =   true;
            alert('Roll Number at row ' + i + ' and at row ' + (inde + 1) + ' is the same. Please give unique roll numbers');
            break;
        }
        rollArray.push(document.getElementById("rollNumberField"+i).value);
    }

    if(duplicate == false) {
        index = 1;
        updateTable();
    }

}

function logout() {
    Parse.User.logOut();
    window.location         =   "index.html";
}

function generate() {

    var pdf                 =   new jsPDF();
    var yy                  =   20;

    pdf.setFontSize(18);
    pdf.text(20, yy, schoolObject.get('username'));

    yy                      +=  10;
    pdf.setFontSize(14);
    pdf.text(20, yy, schoolObject.get('address'));

    yy                      +=  12;
    pdf.setFontSize(10);
    pdf.text(20, yy, 'Dear Chennai Social Service, ');
    yy += 8; pdf.text(20, yy, 'The names below are the nominated students under different categories who shall represent the school'); 
    yy += 5; pdf.text(20, yy, 'during Vegam 2016 on 16th July 2016. The students have been informed of the games they are participating');
    yy += 5; pdf.text(20, yy, 'and also are ideally suited for the designated category of the games. ');
    yy += 8; pdf.text(20, yy, 'The list of the students,');

    yy += 2;
    for (var i = 1; i <= 99; i++) {

        yy += 5;

        rollNoF             =   $('#rollNumberField' + i).val();
        userNameF           =   $('#userNameField' + i).val();
        ageF                =   $('#ageField' + i).val();
        genderF             =   $('#sexCombo' + i).val();
        categoryF           =   $('#categoryCombo' + i).val();
        MRLevelF            =   $('#MRLevel' + i + ' option:selected').text();
        VILevelF            =   $('#VILevel' + i + ' option:selected').text();

        if (rollNoF == '' && userNameF == '') {
            break;
        }

        pdf.text(20, yy, rollNoF);
        pdf.text(50, yy, userNameF);
        pdf.text(100, yy, ageF);
        pdf.text(110, yy, genderF);
        pdf.text(120, yy, categoryF);
        if (categoryF == 'MR') {
            pdf.text(130, yy, MRLevelF);
        } else if (categoryF == 'VI') {
            pdf.text(130, yy, VILevelF);
        }

        if(i == 40) {
            pdf.addPage();
            yy              =   20;
        }

    }

    yy                      +=  25;

    pdf.text(20, yy, 'Principal Signature and Seal');
    pdf.text(130, yy, 'Physical Teacher Signature');

    pdf.save('StudentList.pdf');

}

function updateTable() {
    var studName            =   $("#userNameField" + index).val();
    var rollNo              =   $("#rollNumberField" + index).val();
    var studAge             =   $("#ageField" + index).val();

    if(studName.length == 0 && rollNo.length == 0) {
        setTimeout(function() {
            $("#rowOverlay").fadeOut();
        }, 6000);
    } else {

        var studClass       =   Parse.Object.extend("Student");
        var query           =   new Parse.Query(studClass);
        var rowIndex        =   index;

        if (studName == "") {
            alert('Student name should not be empty for the row ' + index);
            index++;
            setTimeout(updateTable(), 1000);
            return;
        }   

        if (studAge.length == 0) {
            alert('Student age should not be empty for the student' + $('#userNameField' + index).val());
            index++;
            setTimeout(updateTable(), 1000);
            return;
        }   

        if (rollNo.length == 0) {
            alert('Student Roll Number should not be empty for the student' + $('#userNameField' + index).val());
            index++;
            setTimeout(updateTable(), 1000);
            return;
        }   

        query.equalTo("school", schoolObject);
        query.equalTo("ROLLNUMBER", rollNo);
        query.first({
            success:function(studObj) {
                if (studObj) {
                    saveButtonClick(studObj, rowIndex);
                } else {
                    var StudentReg  =   Parse.Object.extend("Student");
                    var studentReg  =   new StudentReg();
                    saveButtonClick(studentReg, rowIndex);
                }
            },
            error: function(studerror) {
            }
        });
        index++;
        setTimeout(updateTable(), 1000);
    }

}

function ageChange(domObj) {
    var idStr               =   domObj.getAttribute('id');
    var index               =   idStr.slice(8);
    //getEvents(index);
}

function sexSelect(domObj) {
    var idStr               =   domObj.getAttribute('id');
    var index               =   idStr.slice(8);
    //getEvents(index);
}

function categorySelect(domObj) {
    var idStr               =   domObj.getAttribute('id');
    var index               =   idStr.slice(13);
    if(document.getElementById('categoryCombo' + index ).value == "MR") {
        document.getElementById("MRLevel" + index).style.display = 'block';
        document.getElementById("VILevel" + index).style.display = 'none';
    }else if(document.getElementById('categoryCombo' + index).value == "VI") {
        document.getElementById("VILevel" + index).style.display = 'block';
        document.getElementById("MRLevel" + index).style.display = 'none';
    }else{
        document.getElementById("VILevel" + index).style.display = 'none';
        document.getElementById("MRLevel" + index).style.display = 'none';
    }

    //getEvents(index);
};

function subCategorySelect(domObj) {
    var idStr               =   domObj.getAttribute('id');
    var index               =   idStr.slice(7);
    //getEvents(index);
}
function confirmStudent(domObj){
    var idStr               =   domObj.getAttribute('id');
    var index               =   idStr.slice(13);
    if(confirm('Are you sure? You cannot edit it once you have confirmed it!')){
        getEvents(index);
    }
}
function saveButtonClick(studentReg, index){
    var categoryValue       =   $('#categoryCombo' + index).val();
    var eventCell           =   $("#eventRow" + index );
    var checkedBoxes        =   eventCell.find(":checked");

    var studName            =   $('#userNameField' + index).val();
    var studRoll            =   $('#rollNumberField' + index).val();

    if (checkedBoxes.length > 2 || checkedBoxes.length == 0) {
        alert('Select a maximum of 2 events for the student ' + studName);
        return;
    }

    if (studName.length == 0) {
        alert('Student name should not be empty for the row number' + index);
        return;
    }   

    showOverlayOnRowIndex(index);

    studentReg.set("no", index);;
    studentReg.set("USERNAME", studName);
    studentReg.set("ROLLNUMBER",studRoll);
    studentReg.set("GENDER",document.getElementById("sexCombo" + index).value);
    studentReg.set("AGE",document.getElementById("ageField" + index).value);
    studentReg.set("CATEGORY", categoryValue);
    studentReg.set("event1", null);
    studentReg.set("event2", null);
    studentReg.set('school', schoolObject);
    if(categoryValue == "MR") {
        studentReg.set("LEVEL",document.getElementById("MRLevel" + index).value);
    } else if (categoryValue == "VI") {
        studentReg.set("LEVEL",document.getElementById("VILevel" + index).value);
    }

    var checkLength         =   checkedBoxes.length;
    checkedBoxes.each(function(i) {
        var eventsClass     =   Parse.Object.extend("EVENTS");
        var query           =   new Parse.Query(eventsClass);
        query.get(this.getAttribute('id'), {
            success:function(obj) {
                if (i == 0) {
                    studentReg.set('event1', obj);
                } else if (i == 1) {
                    studentReg.set('event2', obj);
                }
                if (i == checkLength - 1) {

                    var masterClass     =   Parse.Object.extend("master");
                    var mquery          =   new Parse.Query(masterClass);
                    mquery.get("5R6NQ8pGZe", {
                        success: function(masterData) {
                            console.log(masterData);
                            if (studentReg.get('uniq') == undefined) {
                                console.log(masterData.get('freeStudID'));
                                studentReg.set('uniq', masterData.get('freeStudID'));
                                masterData.increment('freeStudID');
                                masterData.save();
                            }
                            studentReg.save();
                        }, error: function(object, error) {
                            console.log(object);
                            console.log(error);
                        }
                    });
                }
            }, error: function (obj) {
            }
        });
    });
};

function name(){
    var a = document.getElementById('userNameField').value;
    if(a=="")
    {
        alert("Please Enter Your Name");
        document.getElementById('userNameField').focus();
        return false;
    }
    if(!isNaN(a))
    {
        alert("Please Enter Only Characters");
        return false;
    }
    if ((a.length < 5) || (a.length > 15))
    {
        alert("Your Character must be 5 to 15 Character");
        return false;
    }
};

