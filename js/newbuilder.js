var submitButton = document.getElementById("submitButton");
var cancelButton = document.getElementById("cancelButton");

var fieldsToSend = {
    "name": null,
    "logoLink": null,
    "phoneNo": null,
    "mapLink": null,
    "websiteLink": null,
    "backgroundImage": null,
    "emailId": null,
    "officeCity": null,
    "officeRegion": null,
    "officeLocality": null
};

function readDataToSend(){
    var dataToSend = {};
    var fields = Object.keys(fieldsToSend);
    for(i=0;i<fields.length;++i){
        var element = document.getElementById(fields[i]);
        if(element){
            dataToSend[fields[i]] = element.value;
        }
    }
    return JSON.stringify(dataToSend);
}

window.onload = function (event) {
    var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");

    getEmployeeDetails(CONNECTION_DATA.TENET_EMPLOYEE_NEW_BUILDER_PAGE, function(employee){
        wrapUpLoading();
    });

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitButton.disabled = true;
            var dataToSend = readDataToSend();
            sendToServer({
                method: "POST",
                headers: {
                    "x-employee-access-token": employeeAuthToken
                }
            }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_ADD_BUILDER_ENDPOINT, dataToSend, function (response) {
                var responseObj = JSON.parse(response);
                swal("Success", "New Builder Added Successfully", "success").then((value) => {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
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
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
        });
    }

}