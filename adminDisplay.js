
var schoolObject = null;
var studentsList = null;

$( document ).ready(function() {

    //2j15
    //Parse.initialize("BlYcmQmAAvCsDdanA7TJh14KiHrCCqb3z5vPz1Ay", "ovGdJ7e9MJ0wqqcsadYauC9t5aiXvluiuqBrvf3x");

                //2K16
                Parse.initialize("xDSozIKPzcsfEtMJSUpqh88nIJ8gyBZOFpmJIjn0", "rqLvdUmxNKcm8o6tLv9aSCabWHxoi4p6ziJ8wDog");

    var UserClass = Parse.Object.extend("User");
    var query = new Parse.Query(UserClass);
    query.find({
        success: function(results) {
            userSelect  =   document.getElementById('userNameTextBox');
            results.forEach(function(user) {
                userSelect.options[userSelect.options.length] = new Option(user.get('username'), user.get('username'));
            });
        }, error: function(error) {
        }
    });

    $('#retrieveEventsButton').click(function(){
        getEvents();
    });

    $('#eventListButton').click(function(){
        eventStudentRetrieval();
    });

});

function getEvents() {

    var eventsClass         =   Parse.Object.extend("EVENTS");
    var query               =   new Parse.Query(eventsClass);

    var sexValue            =   $('#genderComboField').val();
    var ageValue            =   parseInt($('#ageTextField').val());
    var categoryValue       =   $('#categoryComboField').val();

    query.equalTo("GENDER", sexValue);
    query.lessThanOrEqualTo("AGE_MIN", ageValue);
    query.greaterThanOrEqualTo("AGE_MAX", ageValue);;
    query.equalTo("D_Category", categoryValue); 

    if(categoryValue == "MR") {
        var levelValue      =   parseInt($('#MRLevelComboField').val());
        query.equalTo("D_Level_1_2_3", levelValue);
    } else if (categoryValue == "VI") {
        var levelValue      =   parseInt($('#VILevelComboField').val());
        query.equalTo("D_Level_1_2_3", levelValue);
    }

    query.find({
        success:function(results) {
            populateEvents(results);
        }, 
        error: function(error) {
            console.log('Failure retrieveing events' + error.message );
        }
    });
}

function schoolStudentRetrieval(){

    $('#studTable').empty();
    $('#studTable').append(
        "<thead><tr>"+
        "<th width='4%'> No </th>"+
        "<th width='12%'> Name </th>"+
        "<th width='6%'> Roll No. </th>"+
        "<th width='4%'> Age </th>"+
        "<th width='6%'> Gender </th>"+
        "<th width='7%'> Disability </th>"+
        "<th width='7%'> D.Level</th>"+
        "<th width='16%'> Event 1 </th>"+
        "<th width='16%'> Event 2 </th>"+
        "<th> School </th>"+
        "</tr></thead><tbody>");

   var schoolName = document.getElementById('userNameTextBox').value;

    var UserClass = Parse.Object.extend("User");
    var query = new Parse.Query(UserClass);
    query.equalTo('username', schoolName);
    query.first({
        success: function(obj) {
            schoolObject    =   obj;
            var stuClass=   Parse.Object.extend("Student");
            var stQuery =   new Parse.Query(stuClass);
            stQuery.equalTo("school", schoolObject);
            stQuery.ascending("no");
            stQuery.find({
                success:function(students) {
                    studentsList =   students;
                    if (students.length) {
                        populateTable();
                    }
                }, error:function(stobj, sterr) {
                    console.log('Error fetching student' + sterr.message);
                }
            });
        }, error:function(sobj, serr) {
        }
    });
};

function eventStudentRetrieval() {

    $('#studTable').empty();
    $('#studTable').append(
        "<thead><tr>"+
        "<th width='4%'> No </th>"+
        "<th width='12%'> Name </th>"+
        "<th width='6%'> Roll No. </th>"+
        "<th width='4%'> Age </th>"+
        "<th width='6%'> Gender </th>"+
        "<th width='7%'> Disability </th>"+
        "<th width='7%'> D.Level</th>"+
        "<th width='16%'> Event 1 </th>"+
        "<th width='16%'> Event 2 </th>"+
        "<th> School </th>"+
        "</tr></thead><tbody>");

    var eventID             =   $('input:radio[name=evv]:checked').attr('id');
    var flagIndex           =   0;
    studentsList            =   [];

    // Passing as pointer: https://parse.com/questions/how-to-query-for-class-with-pointer-equal-to-a-string-value
    // retrieve students whose event1 field matches
    var stuClass            =   Parse.Object.extend("Student");
    var stQuery             =   new Parse.Query(stuClass);
    stQuery.equalTo("event1", {
                __type: "Pointer",
                className: "EVENTS",
                objectId: eventID
            });
    stQuery.find({
        success:function(students) {
            studentsList.push.apply(studentsList, students);
            flagIndex++;
            if (flagIndex == 2) {
                populateTable();
            }
        }, error:function(stobj, sterr) {
        }
    });

    // retrieve students whose event2 field matches
    stQuery             =   new Parse.Query(stuClass);
    stQuery.equalTo("event2", {
                __type: "Pointer",
                className: "EVENTS",
                objectId: eventID
            });
    stQuery.find({
        success:function(students) {
            studentsList.push.apply(studentsList, students);
            flagIndex++;;
            if (flagIndex == 2) {
                populateTable();
            }
        }, error:function(stobj, sterr) {
        }
    });

};

function populateEvents(eventList) {

    var openCont            =   document.getElementById('openEventsContainer');
    var frozeCont           =   document.getElementById('frozeEventsContainer');

    $('#openEventsContainer').empty();
    $('#frozeEventsContainer').empty();
    $('#openEventsContainer').append('<u>Open Events</u><br/>');
    $('#frozeEventsContainer').append('<u>Froze Events</u><br/>');
    eventList.forEach(function(evObject) {

        var checkbox        =   document.createElement('input');
        checkbox.type       =   "radio";
        checkbox.name       =   "evv";
        checkbox.id         =   evObject.id;

        var label           =   document.createElement('label')
        label.htmlFor       =   evObject.id;
        label.appendChild(document.createTextNode(evObject.get('EVENT_NAME')));
        label.appendChild(document.createTextNode(" - "));
        label.appendChild(document.createTextNode(evObject.get('TIME')));

        openCont.appendChild(checkbox);
        openCont.appendChild(label);
        openCont.appendChild(document.createElement('br'));

    });

};

function populateTable() {

    studentsList.forEach(function(stud, i) {
        var categ       =   stud.get('CATEGORY');
        var levl        =   stud.get('LEVEL');
        var index       =   i + 1
        var levelString =   "";
        if (categ == 'MR') {
            levelString =   levl == "1" ? "mild" : levl == "2" ? "moderate" : "severe";
        } else if (categ == 'VI') {
            levelString =   levl == "1" ? "partially blind" : "totally blind";
        }
        $('#studTable').append(
            "<tr id='studRow" + (i+1) + "'>"+
            "<td> " + (i+1) + " </td>"+
            "<td> " + stud.get('USERNAME') + " </td>"+
            "<td> " + stud.get('ROLLNUMBER') + " </td>"+
            "<td> " + stud.get('AGE') + " </td>"+
            "<td> " + stud.get('GENDER') + " </td>"+
            "<td> " + categ +  " </td>"+
            "<td> " + levelString + " </td>"+
            "<td id='studRowEventA" + (i+1) + "'> - </td>"+
            "<td id='studRowEventB" + (i+1) + "'> - </td>"+
            "<td id='studRowSchool" + (i+1) + "'> - </td>"+
            "</tr>");

        var eventObject = Parse.Object.extend("EVENTS");

        var eva = stud.get('event1');
        if (eva != null) {
            var evAQuery = new Parse.Query(eventObject);
            evAQuery.get(eva.id, {
                success: function(evv) {
                    var strToDisp = evv.get('EVENT_NAME') + ' - ' + evv.get('TIME')
                    $('#studRowEventA' + index).html(strToDisp);
                },
                error: function(object, error) {
                }
            });
        }

        var evb = stud.get('event2');
        if (evb != null) {
            var evBQuery = new Parse.Query(eventObject);
            evBQuery.get(evb.id, {
                success: function(evv) {
                    var strToDisp = evv.get('EVENT_NAME') + ' - ' + evv.get('TIME')
                    $('#studRowEventB' + index).html(strToDisp);
                },
                error: function(object, error) {
                }
            });
        }

        var schObject = Parse.Object.extend("User");
        var schQuery = new Parse.Query(schObject);
        schQuery.get(stud.get('school').id, {
            success: function(schh) {
                var strToDisp = schh.get('username');
                $('#studRowSchool' + index).html(strToDisp);
            },
            error: function(object, error) {
            }
        });

    });

    $('#studTable').append('</tbody>');
    $("#studTable").tablesorter({
        textExtraction: 'complex',
        debug: true
    }); 

};

function categorySelect() {

    if(document.getElementById('categoryComboField' ).value == "MR") {
        document.getElementById("MRLevelComboField").style.display = 'inline';
        document.getElementById("VILevelComboField").style.display = 'none';
    }else if(document.getElementById('categoryComboField').value == "VI") {
        document.getElementById("VILevelComboField").style.display = 'inline';
        document.getElementById("MRLevelComboField").style.display = 'none';
    }else{
        document.getElementById("VILevelComboField").style.display = 'none';
        document.getElementById("MRLevelComboField").style.display = 'none';
    }
}

