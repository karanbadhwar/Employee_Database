const url = 'https://randomuser.me/api/?results=12';
const employeeDB = document.querySelector('employee-data');
const list = document.querySelector('.list');
const overlay = document.querySelector('.overlay');
const cross = document.querySelector('.cross');
const main = document.querySelector('main');
const greater = document.querySelector('.greater');
const smaller = document.querySelector('.smaller');
const form = document.querySelector('form');
fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(res => generateHTML(res.results))
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

/**
 * Function generateHTML, creates the div to be inserted inside the List 
 * It calles two callback inside to reformat the Phone number and Date of Birth.
 * It eventually appends the data at the end on every Iteration
 */
function generateHTML(data){
    console.log(data);
    data.forEach(person => {
        const add = person.location;
        const cell = regexPhone(person.cell);
        const dob = regexDOB(person.dob.date);

        const li =  `<div class="modal-window">
                     <img src= '${person.picture.medium}'>
                     <p class="name">${person.name.first} ${person.name.last}</p>
                     <p class="email">${person.email}</p>
                     <p class="address">${person.location.city}, ${person.location.state} </p>
                     <hr class="deactivate">
                     <p class='cell deactivate'>${cell}</p>
                     <p class="full-address deactivate">${add.street.number}, ${add.street.name}, ${add.city}, ${add.state}, ${add.postcode}</p>
                     <p class="dob deactivate">Birthday: ${dob}</p>
                 </div>`;
        list.insertAdjacentHTML('beforeend',li);
        
    });
    

}
/*-----------Helper Functions---------*/
// Regex
/**
 * Function regexPhone, is a callback function called inside the generateHTML function, to re-format the phone number.
 * @param {*} data , is the phone number retrived from the data which was retrieved via API.

 * @returns , number which is the fromated phone number in the format we asked for
 */
function regexPhone(data){
    // const regex = /^\(?\d+\)?[ -]?\(?\d+\)?[ -]?\d+[ -]?\d*$/;
    let number = data.replace(/[^\d]/g, '');

    number = number.replace(/(\d{3})(\d{3})(\d{2,})/, "($1) $2-$3");
    return number;
    
}

/**
 * Function regexDOB, is a callback function to re-format the Date of Birth and is being called inside the generateHTML function
 * @param {*} data , is the DOB retirieved for every indidual that was retirved via API
 * @returns Date Of Birth, in the asked fromat
 */
function regexDOB(data){
    let dob = data.replace(/[^\d]/g, '');
    dob = dob.replace(/(\d{4})(\d{2})(\d{2})(\d+)/, "$2/$3/$1");
    return dob;
}

//Callback function
/**
 * Function modal, is a callback function, which creates a Clone of the clicked div, to popup a Overlay.
 * It only gets activated when the image is clicked.
 * It is made as we donot use extra space and just clone the desired Div and removes it whenever the X symbol is clicked.
 * @param {*} e , Event Object passed via Event Handler
 */
function modal(e){
    if(overlay.children.length === 4){
        const overlayDIV = document.querySelector('.overlay div');
        overlay.removeChild(overlayDIV);
    }

 if(e.target.tagName === 'IMG'){
        const modal = e.target.parentElement;
        const clone = modal.cloneNode(true);
        cross.classList.remove('deactivate');
        greater.classList.remove('deactivate');
        smaller.classList.remove('deactivate');
        overlay.appendChild(activate(clone));
        main.style.opacity = '0.5';
    }else{
        cross.classList.add('deactivate');
        greater.classList.add('deactivate');
        smaller.classList.add('deactivate');
        main.style.opacity ='1';
    }
}
/**
 * Function activate, is a callback function, which is used to remove the DEACTIVATE class from the elements.
 * it Checks for the deactivate class and removes that.
 * @param {*} div 
 * @returns div, without the DEACTIVATE class.
 */
 function activate(div){
     for(let i = 0; i < div.children.length; i++){
        if (div.children[i].classList[0] === 'deactivate' || div.children[i].classList[1] === 'deactivate'){
            div.children[i].classList.remove('deactivate');
        }
     }
     return div;
 }
/**
 * Function move, is a callback function, which gets triggered, when the overlay is Crossed or is asked to move,
 * Forward or Backward from the list.
 * It has 3 If else block that checks wheather the User has asked to close the overlay Window or Move forward or backward
 * @param {*} e , e is the event object passed via Event Handler
 */
function move(e){
    const click = e.target;
    if(click.className === 'cross'){
        const overlayDIV = document.querySelector('.overlay div');
        overlay.removeChild(overlayDIV);
        cross.classList.add('deactivate');
        greater.classList.add('deactivate');
        smaller.classList.add('deactivate');
        main.style.opacity = '1';
    } else if(click.className === 'greater'){
        const divs = list.children;
        // console.log(divs);
        // console.log(list.children[0].children[1].outerText);
        for (let i = 0; i < list.children.length; i++){
            if(divs[i].nextElementSibling){
            const currentOverlay = overlay.lastElementChild.children[1].outerText;
            const name = divs[i].children[1].outerText;
            if(currentOverlay === name ){
                overlay.lastChild.remove();
                const nextSibling = divs[i].nextElementSibling;
                const newDiv = nextSibling.cloneNode(true);
                // for( let i = 0; i < newDiv.children.length; i++){
                    // console.log('Hello')
                    activate(newDiv);
                    // if (newDiv.children[i].classList[1] === 'deactivate' || newDiv.children[i].classList[0] === 'deactivate'){
                    //     newDiv.children[i].classList.remove('deactivate');
                    // }
                // }
                overlay.appendChild(newDiv);
                break;
            }
        }
        }
    }else if(click.className === 'smaller'){
        const divs = list.children;
        // console.log(divs);
        // console.log(list.children[0].children[1].outerText);
        for (let i = 0; i < list.children.length; i++){
            if (divs[i].previousElementSibling){
                smaller.style.opacity = '1';
            const currentOverlay = overlay.lastElementChild.children[1].outerText;
            const name = divs[i].children[1].outerText;
            if(currentOverlay === name ){
                overlay.lastChild.remove();
                const previousSibling = divs[i].previousElementSibling;
                const newDiv = previousSibling.cloneNode(true);
                // for( let i = 0; i < newDiv.children.length; i++){
                //     if (newDiv.children[i].classList[0] === 'deactivate' || newDiv.children[i].classList[1] === 'deactivate'){
                //         newDiv.children[i].classList.remove('deactivate');
                //     }
                // }
                activate(newDiv);
                overlay.appendChild(newDiv);
                break;
            }
        }
    }
}
}
/**
 * function search is a callback function used while searching some name from the directory,
 * which checkes weather the searched result Name is in the directory!!!
 * @param {*} e , is the event passed on by the Event Handler
 */
function search(e){
    e.preventDefault();
    // console.log(e.target)
    if(e.target.tagName = 'BUTTON'){
        const input = document.querySelector('input').value.toLowerCase();
        for (let i = 0; i < list.children.length; i++){
            const name = list.children[i].children[1].innerText.toLowerCase();
            if(name.includes(input)){ 
                list.children[i].style.display = '';
            }else {
                list.children[i].style.display = 'none';
            }
        }
        let count = 0;
        const empty = document.querySelector('.empty');
        for (let i = 0; i <list.children.length; i++){
            if(list.children[i].style.display === 'none'){
                count++;
            }
            if(count === 12){
                list.classList.add('deactivate');

                empty.classList.remove('deactivate');
            }else{
                list.className = 'list'
                empty.classList.add('deactivate');
            }
        }
    }
}

//-----------EVENT HANDLER--------------//
list.addEventListener('click', modal );
overlay.addEventListener('click', move);
form.addEventListener('submit', search);