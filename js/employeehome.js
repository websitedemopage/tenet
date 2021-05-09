function getBuilderElement(data){
    var builderId = String(data.builderId).padStart(5, " ").replaceAll(" ", "0");
    return "<li class=\"collection-item\"><div>"+builderId+"&emsp;<b>"+data.name+"</b><a style=\"padding-left: 10px;\" onclick=\"removeBuilderDetails("+data.builderId+")\" class=\"secondary-content\"><i class=\"material-icons\">delete</i></a><a onclick=\"editBuilderDetails("+data.builderId+")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">edit</i></a><a onclick=\"viewBuilderDetails("+data.builderId+")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">visibility</i></a></div></li>";
}

function getBuilderCollectionFiller(data){
    var collectionList = "<li class=\"collection-header\"><h4>Builders List</h4></li>";
    if(!data || data.length<=0){
        collectionList+="<li class=\"collection-item\"><div></div>No Builders Data Available!...</li>";
    } else {
        for(i=0;i<data.length;++i){
            collectionList += getBuilderElement(data[i]);
        }
    }
    return collectionList;
}

function editBuilderDetails(builderId){
    swal("Sorry!...", "The Functionality to edit builder with builder id "+builderId+" is not added", "info");
}

function removeBuilderDetails(builderId){
    swal("Sorry!...", "The Functionality to remove builder with builder id "+builderId+" is not added", "info");
}

function viewBuilderDetails(builderId){
    window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_DETAILS_PAGE + "?builderId=" + builderId;
}

function fillEmployeeProfileFields(data){
    var profileFields = Object.keys(data);
    for(i=0;i<profileFields.length;++i){
        var valueElements = document.getElementsByClassName("value-employee-"+profileFields[i]);
        for(j=0;j<valueElements.length;++j){
            valueElements[j].innerHTML = data[profileFields[i]];
        }
        var rowElements = document.getElementsByClassName("row-employee-"+profileFields[i]);
        for(j=0;j<rowElements.length;++j){
            rowElements[j].classList.remove("removeFromScreen");
        }
    }
}

window.onload = function(event){
    
    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON, function(employee){
        wrapUpLoading();
        fillEmployeeProfileFields(employee);
        getAllBuildersList(function(allbuilderslist){
            document.getElementById("buildersListElement").innerHTML = getBuilderCollectionFiller(allbuilderslist);
        });
    });

    var newBuilderButtons = document.getElementsByClassName("addNewBuilderDetailsButton");
    for(g=0;g<newBuilderButtons.length;++g){
        newBuilderButtons[g].addEventListener('click', function(event){
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_NEW_BUILDER_PAGE;
        });
    }

    var signOutButtons = document.getElementsByClassName("signOutButton");
    for(g=0;g<signOutButtons.length;++g){
        signOutButtons[g].addEventListener('click', function(event){
            event.preventDefault();
            window.localStorage.removeItem("tenetEmployeeAuthToken");
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        });
    }

}