var apartmentId = undefined;
const queryString = window.location.search;

function fillApartmentProfileFields(data){
    var profileFields = Object.keys(data);
    for(i=0;i<profileFields.length;++i){
        var valueElements = document.getElementsByClassName("value-apartment-"+profileFields[i]);
        for(j=0;j<valueElements.length;++j){
            valueElements[j].innerHTML = data[profileFields[i]];
        }
        var rowElements = document.getElementsByClassName("row-apartment-"+profileFields[i]);
        for(j=0;j<rowElements.length;++j){
            rowElements[j].classList.remove("removeFromScreen");
        }
    }
    if(data.pricing){
        var dataStr = "";
        for(i=0;i<data.pricing.length;++i){
            dataStr += "<span>For <b>"+data.pricing[i].preference+"</b> the monthly rent is <b>"+data.pricing[i].rent+"</b> and deposit required is <b>"+data.pricing[i].deposit+"</b><br/>";
        }
        document.getElementById("pricingDataValues").innerHTML = dataStr;
        document.getElementById("apartment-pricingDataValues").classList.remove("removeFromScreen");
    }
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_PROPERTY_DETAILS_PAGE+queryString, function(employee){
        const urlParams = new URLSearchParams(queryString);
        apartmentId = urlParams.get('apartmentId');
        if(!apartmentId){
            swal("Sorry", "Invalid Apartment Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getApartmentDetails(apartmentId, function(apartment){
            if(!apartment){
                swal("Sorry", "Invalid Apartment Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
            fillApartmentProfileFields(apartment);
            getBuildingDetails(apartment.buildingId, function(building){
                if(!building){
                    return;
                }
                apartment["buildingName"] = building.name;
                apartment["builderId"] = building.builderId;
                fillApartmentProfileFields(apartment);
                getBuilderDetails(building.builderId, function(builder){
                    if(!builder){
                        return;
                    }
                    apartment["builderName"] = builder.name;
                    fillApartmentProfileFields(apartment);
                });
            });
        });
    });

    var homeButtons = document.getElementsByClassName("homeButton");
    for(g=0;g<homeButtons.length;++g){
        homeButtons[g].addEventListener('click', function(event){
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        });
    }

}