'use strict';

const apiKey = "p1F6hitSASpXdVy7Na2EprT6nkdIA7HLvqhD2u0p";
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//format paramaters with encodeURI and .join('&')
function formatParams(params) {
  const queryItems = Object.keys(params)
    .map(key => {
      if (key === "stateCode")//the state code is already formated and does not need to be encoded
        return `${key}=${params[key]}`;
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
  return queryItems.join('&');
}

//after paramaters are formated, fetch the finished URL
function getParks(query, limit = 10) {
  const params = {
    stateCode: query,
    limit,
    api_key: apiKey,
  }
  const queryString = formatParams(params)
  const url = searchURL + "?" + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//iterate through responseJson and display name, description, and URL to page
function displayResults(responseJson) {
  $("#results").empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $("#results").append(`<h3>${responseJson.data[i].fullName}</h3>
                        <p>${responseJson.data[i].description}</p>
                        <p>URL: <a href=${responseJson.data[i].url}>${responseJson.data[i].url}</a></p><br />`);
  }
  $("#results").removeClass("hidden");
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const states = $('.state:checked').toArray().map(el => $(el).val()).join(',');//state code is formated here.
    const maxResults = $('#js-max-results').val();
    $('input[type="checkbox"]').prop('checked', false); //uncheck check boxes after form is submitted. 
    getParks(states, maxResults);
  });
}

$(watchForm);