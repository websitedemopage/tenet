function sendToServer(
  options,
  endpoint,
  data,
  successCallback,
  failureCallback
) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      successCallback(this.responseText);
    } else if (this.readyState == 4 && this.status != 200) {
      failureCallback(this.responseText);
    }
  };
  xhttp.open(options.method, endpoint, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  if (options.headers) {
    var keys = Object.keys(options.headers);
    for (j = 0; j < keys.length; ++j) {
      xhttp.setRequestHeader(keys[j], options.headers[keys[j]]);
    }
  }
  xhttp.send(data);
}

function markInvalidFields(invalidInputs) {
  var k = 3;
  while (k > 0 && document.getElementsByClassName("invalid").length > 0) {
    var invalidElementsList = document.getElementsByClassName("invalid");
    for (i = 0; i < invalidElementsList.length; ++i) {
      invalidElementsList[i].classList.remove("invalid");
    }
    k = k - 1;
  }
  k = 3;
  while (k > 0 && document.getElementsByClassName("invalid-value-marker").length > 0) {
    var invalidElementsList = document.getElementsByClassName("invalid-value-marker");
    for (i = 0; i < invalidElementsList.length; ++i) {
      invalidElementsList[i].innerHTML = "";
    }
    k = k - 1;
  }
  if (!invalidInputs) {
    return;
  }
  for (i = 0; i < invalidInputs.length; ++i) {
    var element1 = document.getElementById(invalidInputs[i][0]);
    var element2 = document.getElementById("span-" + invalidInputs[i][0]);
    var element3 = document.getElementById("invalid-value-marker-" + invalidInputs[i][0]);
    if (element2) {
      element2.setAttribute("data-error", invalidInputs[i][1]);
    }
    if (element1) {
      element1.classList.add("invalid");
    }
    if (element3) {
      element3.innerHTML = invalidInputs[i][1];
    }
  }
}

function wrapUpLoading() {
  if (window.localStorage.getItem("redirectUrl")) {
    window.localStorage.removeItem("redirectUrl");
  }
  var j = 3;
  var loaderElements = document.getElementsByClassName("pageLoader");
  while (j > 0 && loaderElements.length > 0) {
    for (k = 0; k < loaderElements.length; ++k) {
      loaderElements[k].classList.add("removeFromScreen");
      loaderElements[k].classList.remove("pageLoader");
    }
    loaderElements = document.getElementsByClassName("pageLoader");
    j = j - 1;
  }
  j = 3;
  var contentElements = document.getElementsByClassName(
    "pageContentWhileLoading"
  );
  while (j > 0 && contentElements.length > 0) {
    for (k = 0; k < contentElements.length; ++k) {
      contentElements[k].classList.remove("pageContentWhileLoading");
    }
    contentElements = document.getElementsByClassName(
      "pageContentWhileLoading"
    );
    j = j - 1;
  }
}

function getEmployeeDetails(currentPage, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!employeeAuthToken) {
    window.localStorage.setItem("redirectUrl", currentPage);
    window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
  }
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
      var responseObj = JSON.parse(response);
      callback(responseObj);
    },
    function (response) {
      console.log("ERROR : " + response);
      var responseObj = JSON.parse(response);
      swal("Authentication Failed", responseObj.errormessage, "error").then(
        (value) => {
          window.localStorage.setItem("redirectUrl", currentPage);
          window.localStorage.removeItem("tenetEmployeeAuthToken");
          window.location = CONNECTION_DATA.TENET_EMPLOYEE_LOGIN_PAGE;
        }
      );
    }
  );
}

function getAllBuildersList(callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  sendToServer({
      method: "POST",
      headers: {
        "x-employee-access-token": employeeAuthToken,
      },
    },
    CONNECTION_DATA.TENET_DOMAIN +
    CONNECTION_DATA.TENET_ALL_BUILDERS_LIST_ENDPOINT,
    "",
    function (response1) {
      var responseObj1 = JSON.parse(response1);
      callback(responseObj1);
    },
    function (response1) {
      console.log("ERROR : " + response1);
      callback(null);
    }
  );
}

function getBuilderDetails(builderId, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!builderId) {
    callback(null);
  } else {
    sendToServer({
        method: "POST",
        headers: {
          "x-employee-access-token": employeeAuthToken,
        },
      },
      CONNECTION_DATA.TENET_DOMAIN +
      CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_PROFILE_ENDPOINT_PART_1 + builderId + CONNECTION_DATA.TENET_EMPLOYEE_BUILDER_PROFILE_ENDPOINT_PART_2,
      "",
      function (response1) {
        var responseObj1 = JSON.parse(response1);
        callback(responseObj1);
      },
      function (response1) {
        console.log("ERROR : " + response1);
        callback(null);
      }
    );
  }
}

function getBuilderAllProjectsDetails(builderId, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!builderId) {
    callback(null);
  } else {
    sendToServer({
        method: "POST",
        headers: {
          "x-employee-access-token": employeeAuthToken,
        },
      },
      CONNECTION_DATA.TENET_DOMAIN +
      CONNECTION_DATA.TENET_BUILDERS_ALL_PROJECTS_ENDPOINT_PART_1 + builderId + CONNECTION_DATA.TENET_BUILDERS_ALL_PROJECTS_ENDPOINT_PART_2,
      "",
      function (response1) {
        var responseObj1 = JSON.parse(response1);
        callback(responseObj1);
      },
      function (response1) {
        console.log("ERROR : " + response1);
        callback(null);
      }
    );
  }
}

function getBuildingDetails(buildingId, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!buildingId) {
    callback(null);
  } else {
    sendToServer({
        method: "POST",
        headers: {
          "x-employee-access-token": employeeAuthToken,
        },
      },
      CONNECTION_DATA.TENET_DOMAIN +
      CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_PROFILE_ENDPOINT_PART_1 + buildingId + CONNECTION_DATA.TENET_EMPLOYEE_BUILDING_PROFILE_ENDPOINT_PART_2,
      "",
      function (response1) {
        var responseObj1 = JSON.parse(response1);
        callback(responseObj1);
      },
      function (response1) {
        console.log("ERROR : " + response1);
        callback(null);
      }
    );
  }
}

function getAllApartmentsInBuildingDetails(buildingId, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!buildingId) {
    callback(null);
  } else {
    sendToServer({
        method: "POST",
        headers: {
          "x-employee-access-token": employeeAuthToken,
        },
      },
      CONNECTION_DATA.TENET_DOMAIN +
      CONNECTION_DATA.TENET_ALL_PROPERTIES_IN_BUILDING_ENDPOINT_PART_1 + buildingId + CONNECTION_DATA.TENET_ALL_PROPERTIES_IN_BUILDING_ENDPOINT_PART_2,
      "",
      function (response1) {
        var responseObj1 = JSON.parse(response1);
        callback(responseObj1);
      },
      function (response1) {
        console.log("ERROR : " + response1);
        callback(null);
      }
    );
  }
}

function getApartmentDetails(apartmentId, callback) {
  var employeeAuthToken = window.localStorage.getItem("tenetEmployeeAuthToken");
  if (!apartmentId) {
    callback(null);
  } else {
    sendToServer({
        method: "POST",
        headers: {
          "x-employee-access-token": employeeAuthToken,
        },
      },
      CONNECTION_DATA.TENET_DOMAIN +
      CONNECTION_DATA.TENET_EMPLOYEE_PROPERTY_PROFILE_ENDPOINT_PART_1 + apartmentId + CONNECTION_DATA.TENET_EMPLOYEE_PROPERTY_PROFILE_ENDPOINT_PART_2,
      "",
      function (response1) {
        var responseObj1 = JSON.parse(response1);
        callback(responseObj1);
      },
      function (response1) {
        console.log("ERROR : " + response1);
        callback(null);
      }
    );
  }
}