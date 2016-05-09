var user_url = "https://api.github.com/users";
var base_url = "https://github.com"
$(function(){


	var source = $("#div-users").html();
	var template = Handlebars.compile(source);	
	getAllUserDetails();

	function getAllUserDetails() {
		if(localStorage.getItem("userArray")) {
			var userArray = JSON.parse(localStorage.getItem("userArray"));
			$("#divUsers").append(template({userRecords: userArray}));
		}
	}

	function showUserDetails(user_name) {
		var userArray = [];
		if(localStorage.getItem("userArray")) {
			userArray = JSON.parse(localStorage.getItem("userArray"));
		}
		$.ajax({
			url: user_url+"/"+user_name,
			success: function(result){

				var userObj = {
					name: result.name,
					login: result.login,
					location: result.location,
					followers: result.followers,
					avatar_url: result.avatar_url
				}
				if (userArray.indexOf(userObj) == -1) {
					userArray.push(userObj);
				}
				localStorage.setItem("userArray", JSON.stringify(userArray));        
				$("#divUsers").append(template({userRecords: [userObj]}));
			},
			error: function(err) {
				alert(err.responseText);
			}
		});
	}

	$("#id-add-user").click(function(){
		var user_name = $("#userName").val();
		if ($('#'+user_name).length === 0) {
			showUserDetails(user_name);
		} else {
  	//Don't add it to dom already present
  }
})
	//Remove dynamically created div.
	$(document).on('click',".delete-user",function(){
		var login = $(this).data("id");
		$("#"+login).remove();
		var userArray = JSON.parse(localStorage.getItem("userArray"));
		var newUserArray = $.grep(userArray, function(record) {
			return record.login != login;
		});

		localStorage.setItem("userArray",JSON.stringify(newUserArray));

	});

	//////////////////////Go to public profile of user

	$(document).on('click',".divUser",function(){
		var login = $(this).attr("id");
    window.location.href = base_url +"/"+login;
	});


  //////////////////Sorting by name, location and followers

  function dynamicSort(property) {
  	var sortOrder = 1;
  	if(property[0] === "-") {
  		sortOrder = -1;
  		property = property.substr(1);
  	}
  	return function (a,b) {
  		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  		return result * sortOrder;
  	}
  }

  	$("#sort-name").click(function(){
  		var userArray = [];
  		if(localStorage.getItem("userArray")) {
  			userArray = JSON.parse(localStorage.getItem("userArray"));
        userArray.sort(dynamicSort("name"));
  			$("#divUsers").html(template({userRecords: userArray}));
  			localStorage.setItem("userArray",JSON.stringify(userArray));
  		}
		
    })

    $("#sort-loca").click(function(){
			var userArray = [];
  		if(localStorage.getItem("userArray")) {
  			userArray = JSON.parse(localStorage.getItem("userArray"));
        userArray.sort(dynamicSort("location"));
  			$("#divUsers").html(template({userRecords: userArray}));
  			localStorage.setItem("userArray",JSON.stringify(userArray));
  		}
    })

    $("#sort-fol").click(function(){
			var userArray = [];
  		if(localStorage.getItem("userArray")) {
  			userArray = JSON.parse(localStorage.getItem("userArray"));
        userArray.sort(dynamicSort("followers"));
  			$("#divUsers").html(template({userRecords: userArray}));
  			localStorage.setItem("userArray",JSON.stringify(userArray));
  		}
    })

})