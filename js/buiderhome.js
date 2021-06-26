var builderId = undefined;
const queryString = window.location.search;

function getBuildingElement(data) {
    var buildingId = String(data.buildingId).padStart(5, " ").replaceAll(" ", "0");
    return "<li class=\"collection-item\"><div>" + buildingId + "&emsp;<b>" + data.name + "</b><a style=\"padding-left: 10px;\" onclick=\"removeBuildingDetails(" + data.buildingId + ")\" class=\"secondary-content\"><i class=\"material-icons\">delete</i></a><a onclick=\"editBuildingDetails(" + data.buildingId + ")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">edit</i></a><a onclick=\"viewBuildingDetails(" + data.buildingId + ")\" style=\"padding-left: 10px;\" class=\"secondary-content\"><i class=\"material-icons\">visibility</i></a></div></li>";
}

function getBuildingCollectionFiller(data) {
    var collectionList = "<li class=\"collection-header\"><h4>Buildings List</h4></li>";
    if (!data || data.length <= 0) {
        collectionList += "<li class=\"collection-item\"><div></div>No Building Data Available!...</li>";
    } else {
        for (i = 0; i < data.length; ++i) {
            collectionList += getBuildingElement(data[i]);
        }
    }
    return collectionList;
}

function editBuildingDetails(buildingId) {
    swal("Sorry!...", "The Functionality to edit building with building id " + buildingId + " is not added", "info");
}

function removeBuildingDetails(buildingId) {
    swal("Sorry!...", "The Functionality to remove building with building id " + buildingId + " is not added", "info");
}

function viewBuildingDetails(buildingId) {
    window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE + "?buildingId=" + buildingId;
}

function fillBuilderProfileFields(data) {
    var profileFields = Object.keys(data);
    for (i = 0; i < profileFields.length; ++i) {
        var valueElements = document.getElementsByClassName("value-builder-" + profileFields[i]);
        for (j = 0; j < valueElements.length; ++j) {
            valueElements[j].innerHTML = data[profileFields[i]];
        }
        var rowElements = document.getElementsByClassName("row-builder-" + profileFields[i]);
        for (j = 0; j < rowElements.length; ++j) {
            rowElements[j].classList.remove("removeFromScreen");
        }
    }
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_DETAILS_PAGE + queryString, function (employee) {
        const urlParams = new URLSearchParams(queryString);
        builderId = urlParams.get('builderId');
        if (!builderId) {
            swal("Sorry", "Invalid Builder Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuilderDetails(builderId, function (builder) {
            if (!builder) {
                swal("Sorry", "Invalid Builder Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
            fillBuilderProfileFields(builder);
            getBuilderAllProjectsDetails(builderId, function (projectsList) {
                document.getElementById("buildingsListElement").innerHTML = getBuildingCollectionFiller(projectsList);
            });
        });
    });

    var newBuildingButtons = document.getElementsByClassName("addNewBuildingDetailsButton");
    for (g = 0; g < newBuildingButtons.length; ++g) {
        newBuildingButtons[g].addEventListener('click', function (event) {
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_NEW_BUILDING_PAGE + "?builderId=" + builderId;
        });
    }

    var homeButtons = document.getElementsByClassName("homeButton");
    for (g = 0; g < homeButtons.length; ++g) {
        homeButtons[g].addEventListener('click', function (event) {
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        });
    }

}