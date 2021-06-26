var submitButton = document.getElementById("submitButton");
var signInWithGoogleButton = document.getElementById("signInWithGoogleButton");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var authToken = urlParams.get('authToken');
if (authToken) {
    window.localStorage.removeItem("tenetEmployeeAuthToken");
    sendToServer({
            method: "POST",
            headers: {
                "x-access-token": authToken,
            },
        },
        CONNECTION_DATA.TENET_DOMAIN +
        CONNECTION_DATA.TENET_EMPLOYEE_TOKEN_ENDPOINT,
        "",
        function (response) {
            var responseObj = JSON.parse(response);
            window.localStorage.setItem("tenetEmployeeAuthToken", responseObj.authToken);
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
        },
        function (response) {
            console.log("ERROR : " + response);
            var responseObj = JSON.parse(response);
            swal("Sorry!..", responseObj.errormessage, "error");
        }
    );
}

var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
if (employeeAuthToken) {
    sendToServer({
            method: "POST",
            headers: {
                "x-employee-access-token": employeeAuthToken,
            },
        },
        CONNECTION_DATA.TENET_DOMAIN +
        CONNECTION_DATA.TENET_EMPLOYEE_PROFILE_ENDPOINT,
        "",
        function (response) {
            window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
        },
        function (response) {
            window.localStorage.removeItem("tenetEmployeeAuthToken");
        }
    );
}

if (submitButton) {
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        submitButton.disabled = true;
        var dataToSend = JSON.stringify({
            emailId: document.getElementById("emailId").value,
            password: document.getElementById("password").value
        });
        document.getElementById("password").value = "";
        sendToServer({
            method: "POST"
        }, CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_ENDPOINT, dataToSend, function (response) {
            var responseObj = JSON.parse(response);
            window.localStorage.setItem("tenetEmployeeAuthToken", responseObj.authToken);
            console.log(window.localStorage.getItem("redirectUrl"));
            swal("Login Success", "Welcome", "success").then((value) => {
                var redirectUrl = window.localStorage.getItem("redirectUrl");
                if (redirectUrl) {
                    window.localStorage.removeItem("redirectUrl");
                    window.location = redirectUrl;
                } else {
                    window.location = CONNECTION_DATA.TENET_EMPLOYEE_REDIRECT_URL_AFTER_SIGN_ON;
                }
            });
        }, function (response) {
            console.log("ERROR : " + response);
            window.localStorage.removeItem("tenetEmployeeAuthToken");
            var responseObj = JSON.parse(response);
            markInvalidFields(responseObj.invalidInputs);
            swal("Sorry!..", responseObj.errormessage, "error");
            submitButton.disabled = false;
        });
    });
}

if (signInWithGoogleButton) {
    signInWithGoogleButton.addEventListener("click", function (event) {
        event.preventDefault();
        signInWithGoogleButton.disabled = true;
        var callBackUrl = new URL(CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE, window.location);
        window.location = CONNECTION_DATA.TENET_DOMAIN + CONNECTION_DATA.TENET_GOOGLE_SIGNIN_ENDPOINT + "?redirectUrl=" + callBackUrl.href;
    });
}