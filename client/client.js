const handleResponse = (xhr, parseResponse) => {
    const content = document.querySelector('#content');

    switch (xhr.status) {
        case 200:
            content.innerHTML = '<b>Success</b>';
            break;
        case 201:
            content.innerHTML = '<b>Created</b>';
            break;
        case 204:
            content.innerHTML = '<b>Updated (No Content)</b>';
            break;
        case 400:
            content.innerHTML = '<b>Bad Request</b>';
            break;
        default:
            content.innerHTML = '<b>404 Error</b>';
            break;
    }


    if (parseResponse) {

        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        //prints the message if there is one to client
        if (obj.message) {
            content.innerHTML += `<p>${obj.message}</p>`;
        }
        //otherwise just prints the xhr response
        else {
            content.innerHTML += `<p>${xhr.response}</p>`;
        }
    }

};

const sendPost = (e, dreamForm) => {
    const dreamAction = dreamForm.getAttribute('action');
    const dreamMethod = dreamForm.getAttribute('method');

    const titleField = dreamForm.querySelector('#title');
    const dateField = dreamForm.querySelector('#dateField');
    const startField = dreamForm.querySelector('#startBed');
    const endField = dreamForm.querySelector('#endBed')
    const category = dreamForm.querySelector('#dreamType');
    const description = dreamForm.querySelector('#description');

    const xhr = new XMLHttpRequest();
    xhr.open(dreamMethod, dreamAction); //sends to server; let's it know it's a POST request to /addUser

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr, true);

    const formData = `title=${titleField.value}&date=${dateField.value}&start=${startField.value}&end=${endField}&category=${category.value}&description=${description.value}`; //end part of url that contains form data

    xhr.send(formData);
    console.dir(formData);

    e.preventDefault();
    return false;

}

/*const requestUpdate = (e, userForm) => {
      //grab url field 
      const url = userForm.querySelector('#urlField').value;
      //grab method selected
      const method = userForm.querySelector('#methodSelect').value;
      
      //create a new AJAX request (asynchronous)
      const xhr = new XMLHttpRequest();

      xhr.open(method, url);

      xhr.setRequestHeader('Accept', 'application/json');
      //if get request or head request
      if(method == 'get') {
        xhr.onload = () => handleResponse(xhr, true);
      } else {
        xhr.onload = () => handleResponse(xhr, false);
      }
      
      //send ajax request
      xhr.send();
      
      //cancel browser's default action
      e.preventDefault();
      //return false to prevent page redirection from a form
      return false;
    }; */

const init = () => {
    //get dream form
    const dreamForm = document.querySelector('#dreamForm');

    const addDream = (e) => sendPost(e, dreamForm);

    dreamForm.addEventListener('submit', addDream)
}

window.onload = init;
