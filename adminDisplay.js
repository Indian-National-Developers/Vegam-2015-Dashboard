
var schoolObject = null;
var studentsList = null;

$( document ).ready(function() {
    Parse.initialize("BlYcmQmAAvCsDdanA7TJh14KiHrCCqb3z5vPz1Ay", "ovGdJ7e9MJ0wqqcsadYauC9t5aiXvluiuqBrvf3x");
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
});

function schoolStudentRetrieval(){

    $('#studTable').empty();
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

function populateTable() {

    $('#studTable').append(
        "<tr>"+
        "<th width='4%'> No </th>"+
        "<th width='15%'> Name </th>"+
        "<th width='10%'> Roll Number </th>"+
        "<th width='4%'> Age </th>"+
        "<th width='4%'> Gender </th>"+
        "<th width='9%'> Disability </th>"+
        "<th width='9%'> D.Level</th>"+
        "<th width='20%'> Event 1 </th>"+
        "<th width='20%'> Event 2 </th>"+
        "</tr>");

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
            "<td id='studRowEventA" + (i+1) + "'> </td>"+
            "<td id='studRowEventB" + (i+1) + "'> </td>"+
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

    });

};


