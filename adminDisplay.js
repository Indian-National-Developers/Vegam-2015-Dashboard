function loadSchoolFromParse(){
                Parse.initialize("BlYcmQmAAvCsDdanA7TJh14KiHrCCqb3z5vPz1Ay", "ovGdJ7e9MJ0wqqcsadYauC9t5aiXvluiuqBrvf3x");

                var UserClass = Parse.Object.extend("User");
                var query = new Parse.Query(UserClass);
                query.find({
                    success: function(results) {
                        userSelect  =   document.getElementById('userNameTextBox');
                        results.forEach(function(user) {
                            userSelect.options[userSelect.options.length] = new Option(user.get('username'), user.get('username'));
                            console.log(user.get('username'));
                        });
                    }, error: function(error) {
                    }
                });

                $('#passwordTextBox').keypress(function(e) {
                    if(e.which == 13) {
                        loginButtonClick();
                    }
                });

            }
/*
function studentRetrieval(){
	var studClass = Parse.Object.extend("Student");
	var query = new Parse.Query(studClass);
	query.find({
	success: function(studClass) {
		console.log("Successfully retrieved " + studClass.length + " data.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < studClass.length; i++) { 
      var object = studClass[i];
      console.log(object.get('Username'));
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
}			
*/			
function display(){
				var User = Parse.Object.extend("User");
				var query = new Parse.Query(User);
				query.count({
					success: function(count) {
						// The count request succeeded. Show the count	
						//document.getElementById("schoolnum").innerHTML = ("Number of Registered Schools: " + count);
						//console.log(count);
					},
					error: function(error) {
                        console.log("school count request faild");
					}
				});
				var St = Parse.Object.extend("Student");
				var squery = new Parse.Query(St);
				squery.count({
					success: function(count) {
						// The count request succeeded. Show the count	
						//document.getElementById("studnum").innerHTML = ("Number of Registered Students: " + count);
						//console.log(count);
					},
					error: function(error) {
                        console.log("school count request faild");
					}
				});
            }
			
/*			
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
*/