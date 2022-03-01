const url = 'https://randomuser.me/api/?results=12';
const employeeDB = document.querySelector('employee-data');

fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(res => console.log(res.results))
    .catch(err => console.log('Error Fetching Data:',err));
/**
 * A function to check any HTTP errors, accepts one parameter,which is the response object from the Fetch Promise.
 * @param {*} response, response holds all theinfo about the data received from the Fetch(url) link 
 * @returns A Promise resolve or reject,depends on the status of the response
 */
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText));
    }
}

// function generateHTML