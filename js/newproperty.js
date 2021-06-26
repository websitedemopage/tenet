var buildingId = undefined;
const queryString = window.location.search;
var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");

function pricingPreferenceElementsGroup() {
    return "<div class=\"row\"><div class=\"input-field col s12 m6 l4\"><input class=\"pricingPreference\" placeholder=\"Preference\" type=\"text\"><label>Preference</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"pricingRent\" placeholder=\"Rent\" type=\"text\"><label>Rent</label></div><div class=\"input-field col s12 m6 l4\"><input class=\"pricingDeposit\" placeholder=\"Deposit\" type=\"text\"><label>Deposit</label></div></div>";
}

function add(buttonNode) {
    var parentNode = buttonNode.parentNode;
    var siblingNode = parentNode.previousElementSibling;
    siblingNode.innerHTML += pricingPreferenceElementsGroup();
}

function changeType(dropDownBoxNode) {
    var visible = "Rent";
    var invisible = "Sale";
    if (dropDownBoxNode.value == "Sale") {
        invisible = "Rent";
        visible = "Sale";
    }
    var selectedTypeNodes = document.getElementsByClassName("for" + invisible + "Data");
    var i = 0;
    for (i = 0; i < selectedTypeNodes.length; ++i) {
        selectedTypeNodes[i].style.display = "none";
    }
    selectedTypeNodes = document.getElementsByClassName("for" + visible + "Data");
    for (i = 0; i < selectedTypeNodes.length; ++i) {
        selectedTypeNodes[i].style.display = "block";
    }
}

const getBuildingId = function () {
    return buildingId;
}

const noChange = function (fieldName) {
    var element = document.getElementById(fieldName);
    if (!element) {
        return undefined;
    }
    var value = element.value;
    if (!value) {
        value = "";
    }
    return value.trim();
}

const readFromCheckBox = function (fieldName) {
    var checkboxes = document.querySelectorAll("input[name=\"" + fieldName + "\"]:checked");
    if (checkboxes.length <= 0) {
        return undefined;
    }
    var data = [];
    checkboxes.forEach((checkbox) => {
        data.push(checkbox.value);
    });
    return data.join(",");
}

const readFromMultipleTextFields = function (fieldName) {
    var textboxes = document.getElementsByClassName(fieldName);
    if (textboxes.length <= 0) {
        return undefined;
    }
    var data = [];
    for (var f = 0; f < textboxes.length; ++f) {
        data.push(textboxes[f].value);
    }
    return data.join(",");
}

const fieldsToSend = {
    "label": noChange,
    "pricingPreference": readFromMultipleTextFields,
    "pricingRent": readFromMultipleTextFields,
    "pricingDeposit": readFromMultipleTextFields,
    "area": noChange,
    "furnishing": noChange,
    "bedrooms": noChange,
    "bathrooms": noChange,
    "amenitiesAndAppliances": readFromCheckBox,
    "buildingId": getBuildingId,
    "rentOrBuy": noChange,
    "salePrice": noChange,
    "photoLinksKitchen": noChange,
    "photoLinksRooms": noChange,
    "photoLinksHall": noChange,
    "photoLinksOthers": noChange,
    "contactDetails": noChange,
    "configuration": noChange,
    "salePriceUnit": noChange,
    "status": noChange,
    "ownerName": noChange,
    "alternatePhoneNumber": noChange,
    "ownerPlaceOfResidence": noChange
};

function readDataToSend() {
    var dataToSend = {};
    var fieldNamesToSend = Object.keys(fieldsToSend);
    var i = 0;
    for (i = 0; i < fieldNamesToSend.length; ++i) {
        dataToSend[fieldNamesToSend[i]] = fieldsToSend[fieldNamesToSend[i]](fieldNamesToSend[i]);
    }
    return JSON.stringify(dataToSend);
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
});

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_NEW_PROPERTY_PAGE + queryString, function (employee) {
        const urlParams = new URLSearchParams(queryString);
        buildingId = urlParams.get('buildingId');
        if (!buildingId) {
            swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
            });
            return;
        }
        getBuildingDetails(buildingId, function (builder) {
            if (!builder) {
                swal("Sorry", "Invalid Building Id!....", "error").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                });
                return;
            }
            wrapUpLoading();
        });
    });

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            var dataToSend = readDataToSend();
            console.log(dataToSend);
            sendToServer({
                method: "POST",
                headers: {
                    "x-employee-access-token": employeeAuthToken
                }
            }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_ADD_PROPERTY_ENDPOINT, dataToSend, function (response) {
                var responseObj = JSON.parse(response);
                swal("Success", "New Property Added Successfully", "success").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE + "?buildingId=" + buildingId;
                });
            }, function (response) {
                console.log("ERROR : " + response);
                var responseObj = JSON.parse(response);
                markInvalidFields(responseObj.invalidInputs);
                swal("Sorry!..", responseObj.errormessage, "error");
                submitButton.disabled = false;
            });
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", function (event) {
            event.preventDefault();
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_DETAILS_PAGE + "?buildingId=" + buildingId;
        });
    }

}