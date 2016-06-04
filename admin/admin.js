
var schoolObject    =   null;
var studentsList    =   null;
var eventsList      =   null;
var eventsObj       =   null;
var eventParticipantList = null;

$( document ).ready(function() {

    //2K15
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

    $('#pageLoginButton').click(function(){
        if ( $('#passwordField').val() == 'css-2015' ) {
            $.unblockUI();
        }
    });

    //$.blockUI({ message: $('#loginForm') }); 

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
        "<th width='4%'> # </th>"+
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
    $('#studTableDescription').html(schoolName);

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
                        populateStudentTable();
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
                populateStudentTable();
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
                populateStudentTable();
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

function populateStudentTable() {

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

        var prefix      =   categ;

        if (categ == "MR") {
            prefix      +=  levl == "1" ? "A" : levl == "2" ? "B" : "C";
        } else if (categ == "VI") {
            prefix      +=  levl == "1" ? "A" : "B";
        }

        $('#studTable').append(
            "<tr id='studRow" + (i+1) + "'>"+
            "<td> " + (i+1) + " </td>"+
            "<td> " + prefix + pad(stud.get('uniq'), 3) + " </td>"+
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

}

function populateEventTable() {

    eventsList.forEach(function(even, i) {
        var index       =   i + 1
		var ageMax		=	even.get('AGE_MAX');
		var ageMin		=	even.get('AGE_MIN');
		var category	=	even.get('D_Category');
		var level		=	even.get('D_Level_1_2_3');
		var eventName   =   even.get('EVENT_NAME');
		var gender		=	even.get('GENDER');
		var time		=	even.get('TIME');
        var freezeText  =   even.get('freeze') == 1 ? "Unfreeze" : "Freeze";

        $('#eventTable').append(
            "<tr id='eventRow" + (i+1) + "'>"+
            "<td> " + (i+1) + " </td>"+
            "<td> " + ageMin + ' - ' + ageMax + " </td>"+
            "<td> " + category + " </td>"+
            "<td> " + level + " </td>"+
            "<td> " + eventName + " </td>"+
            "<td> " + gender + " </td>"+
            "<td> " + time + " </td>"+
            "<td id='eventRowCount" + (i+1) + "'> - </td>"+
            "<td> <div class='button' onclick='getEventParticipants(" + i + ")' style='width: 60px'>List</div> </td>"+
            "<td> <div id='freezeButton" + i + "' data-eventid='" + even.id + "'  class='button' onclick='toggleFreeze(" + i + ")' style='width: 60px'>" + freezeText + "</div> </td>"+
            "</tr>");

        eventParticipantList = [];
        var studClass   =   Parse.Object.extend("Student");
        var ev1Query    =   new Parse.Query(studClass);
        ev1Query.equalTo("event1", {
                        __type: "Pointer",
                        className: "EVENTS",
                        objectId: even.id
        });
        var ev2Query    =   new Parse.Query(studClass);
        ev2Query.equalTo("event2", {
                        __type: "Pointer",
                        className: "EVENTS",
                        objectId: even.id
        });
        var studQuery   =   Parse.Query.or(ev1Query, ev2Query);
        studQuery.include('school');
        studQuery.find({ 
            success: function(results) {
                $('#eventRowCount' + index).html(results.length);
                eventParticipantList[i] = results;
                if (index == 140) {
                    $("#eventTable").tablesorter(); 
                }
            },
            error: function(error) {
            }  
        });

	});

    $('#eventTable').append('</tbody>');
    

}

function getEventParticipants(eventIndex) {

    $('#studTable').empty();

    var eventObj        =   eventsList[eventIndex];

    var categ           =   eventObj.get('D_Category');
    var levl            =   eventObj.get('D_Level_1_2_3');
    var gender          =   eventObj.get('GENDER');
    var prefix          =   categ;

    var levelText       =   "";
    if (categ == "MR") {
        prefix          +=  levl == "1" ? "A" : levl == "2" ? "B" : "C";
        levelText       =   levl == "1" ? "Mild" : levl == "2" ? "Moderate" : "Severe";
    } else if (categ == "VI") {
        prefix          +=  levl == "1" ? "A" : "B";
        levelText       =   levl == "1" ? "Partially Blind" : "Totally Blind";
    }

    var eventDesc       =   categ +
                            " - " + levelText  + 
                            " " + eventObj.get("AGE_MIN") + " - " + eventObj.get("AGE_MAX") +
                            " " + (gender == "F" ? "Girls" : "Boys") + 
                            " --- " + eventObj.get("EVENT_NAME");
    $('#studTableDescription').html(eventDesc);

    $('#studTable').append(
        "<thead><tr>"+
        "<th width='6%'> No </th>"+
        "<th width='10%'> Chest No </th>"+
        "<th width='12%'> Name </th>"+
        "<th> School </th>"+
        "</tr></thead><tbody>");

    studentsList = _.shuffle(_.shuffle(eventParticipantList[eventIndex]));

    studentsList.forEach(function(stud, i) {
        var index       =   i + 1
        var levelString =   "";

        $('#studTable').append(
            "<tr id='studRow" + (i+1) + "'>"+
            "<td> " + (i+1) + " </td>"+
            "<td> " + prefix + pad(stud.get('uniq'), 3) + " </td>"+
            "<td> " + stud.get('USERNAME') + " </td>"+
            "<td id='studRowSchool" + (i+1) + "'> " + stud.get('school').get('username') + " </td>"+
            "</tr>");
    });

    $('#studTable').append('</tbody>');
    $("#studTable").tablesorter();

}

function toggleFreeze(eventIndex) {

    var buttonObj       =   $('#freezeButton' + eventIndex);
    var buttonText      =   buttonObj.text();
    var eventID         =   buttonObj.attr('data-eventid');

    buttonObj.text("...");

    var eventObject = Parse.Object.extend("EVENTS");
    var evAQuery = new Parse.Query(eventObject);
    evAQuery.get(eventID, {
        success: function(evv) {
                console.log('freezing... ' + evv.id);
                console.log(buttonText);
            if (buttonText == 'Freeze') {
                buttonObj.text("Unfreeze");
                evv.set('freeze', 1);
            } else {
                buttonObj.text("Freeze");
                evv.set('freeze', 0);
            }
            evv.save();
        },
        error: function(object, error) {
        }
    });

}

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

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
