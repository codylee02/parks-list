'use strict';

const baseURL = "https://developer.nps.gov/api/v1/parks"

function displayParksList(responseJson) {
    const parksListHTML = makeParksListHTML(responseJson);
    $(".results").html(parksListHTML);
}

function makeParksListHTML(param) {
    let parksListStr = "";

    for (let i = 0; i < param.data.length; i++) {
        parksListStr += `<ul>${param.data[i].name}
        <li>${param.data[i].description}</li>
        <li><a href="${param.data[i].url}" target="_blank">website</a></li>
        </ul>`
    };
    return parksListStr;
}

function clearResultsAndForm() {
    $(".results").empty();
    $("#js-max-results").val(10);
}

function makeQuery(params) {
    const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`)
    return queryItems.join("&");
}

function getParkResults(inputStates, maxResults) {
    //get list of results from the national parks API
    const params = {
        api_key: apiKey,
        stateCode: inputStates,
        limit: maxResults
    };
    const queryString = makeQuery(params);
    const url = baseURL + "?" + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayParksList(responseJson))
        .catch (err => {
            $(".results").text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
    //listen for submit button click
    $("form").submit (e => {
        e.preventDefault();
        //turn inputs into an array of states
        const inputStates = $("#js-states").val();
        const maxResults = $("#js-max-results").val();
        clearResultsAndForm();
        getParkResults(inputStates, maxResults);
    });
}

$(watchForm);