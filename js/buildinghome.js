var buildingId = undefined;
const queryString = window.location.search;

function getPropertyElement(data){
    var apartmentId = String(data.apartmentId).padStart(5, " ").replaceAll(" ", "0");
    return "<li class=\"collection-item\"><div>"+apartmentId+"&emsp;<b>"+data.label+"</b><a style=\"padding-left: 10px;\" onclick=\"removeApartmentDetails("+data.apartmentId+")\" class=\"secondary-content\"><i class=\"material-icons\">delete</i></a><a onclick=\"editApartmentDetails("+data.apartmentId+")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">edit</i></a><a onclick=\"viewApartmentDetails("+data.apartmentId+")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">visibility</i></a></div></li>";
}

function getPropertyCollectionFiller(data){
    var collectionList = "<li class=\"collection-header\"><h4>Property List</h4></li>";
    if(!data || data.length<=0){
        collectionList+="<li class=\"collection-item\"><div></div>No Property Data Available!...</li>";
    } else {
        for(i=0;i<data.length;++i){
            collectionList += getPropertyElement(data[i]);
        }
    }
    return collectionList;
}

function editApartmentDetails(apartmentId){
    swal("Sorry!...", "The Functionality to edit Apartment with apartment id "+apartmentId+" is not added", "info");
}

function removeApartmentDetails(apartmentId){
    swal("Sorry!...", "The Functionality to remove Apartment with apartment id "+apartmentId+" is not added", "info");
}

function viewApartmentDetails(apartmentId){
    window.location = CONNECTION_DATA.TENET_EMPLOYEE_PROPERTY_DETAILS_PAGE + "?apartmentId=" + apartmentId;
}

function fillBuildingProfileFields(data){
    var profileFields = Object.keys(data);
    for(i=0;i<profileFields.length;++i){
        var valueElements = document.getElementsByClassName("value-building-"+profileFields[i]);
        for(j=0;j<valueElements.length;++j){
            valueElements[j].innerHTML = data[profileFields[i]];
        }
        var rowElements = document.getElementsByClassName("row-building-"+profileFields[i]);
        for(j=0;j<rowElements.length;++j){
            rowElements[j].classList.remove("removeFromScreen");
        }
    }
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE+queryString, function(employee){
        const urlParams = new URLSearchParams(queryString);
        buildingId = urlParams.get('buildingId');
        if(!buildingId){
            swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuildingDetails(buildingId, function(building){
            if(!building){
                swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
            fillBuildingProfileFields(building);
            getAllApartmentsInBuildingDetails(buildingId, function(propertyList){
                document.getElementById("apartmentsListElement").innerHTML = getPropertyCollectionFiller(propertyList);
            });
        });
    });

    var newPropertyButtons = document.getElementsByClassName("addNewPropertyDetailsButton");
    for(g=0;g<newPropertyButtons.length;++g){
        newPropertyButtons[g].addEventListener('click', function(event){
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_NEW_PROPERTY_PAGE+"?buildingId="+buildingId;
        });
    }

    var homeButtons = document.getElementsByClassName("homeButton");
    for(g=0;g<homeButtons.length;++g){
        homeButtons[g].addEventListener('click', function(event){
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        });
    }

}