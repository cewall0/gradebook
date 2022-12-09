"use strict";

// Get elements from index.html by their ids and put into declared variables.
const tableBody = document.getElementById("tableBody");
const classTableBody = document.getElementById("classTableBody");
const nameInput = document.getElementById("nameInput");
const classNameInput = document.getElementById("classNameInput");
const earnedInput = document.getElementById("earnedInput");
const possibleInput = document.getElementById("possibleInput");
const addClassButton = document.getElementById("addClassButton");
const addButton = document.getElementById("addButton");
const goTitlePageButton = document.getElementById("goTitlePageButton");
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

const percentage = document.getElementById("percentage");
const letterGrade = document.getElementById("letterGrade");
const classNameTitle = document.getElementById("classNameTitle");

// get the div element for each main div for the two pages and assign to variables
const titlePage = document.getElementById("titlePage");
const assignmentPage = document.getElementById("assignmentPage");

// Listening for inputs for a new class.
classNameInput.addEventListener("input", validateClassInput);

// Listening for inputs for a new assignment.
nameInput.addEventListener("input", validateInputs);
earnedInput.addEventListener("input", validateInputs);
possibleInput.addEventListener("input", validateInputs);

// registering the click event on the add a class button -
// calling the addClass function.
addClassButton.addEventListener("click", addClass);

// registering the click event to the add assignment button -
// calling the addRecord function
addButton.addEventListener("click", addRecord);

// registering the click event to the Go to Top of the Assignment Page Button
// calling the scrollToTop function
scrollToTopBtn.addEventListener("click", scrollToTop);
var rootElement = document.documentElement;

/**
 * Declaring some variables.
 */
// declaring an empty array to hold the list of our classes.
let classArray = [];

// declaring an empty array to hold our assignment objects.
let assignmentArray = [];

// declaring an empty arraay that will hold our filtered assignments
// for the page we are on.
let filteredArray = [];

// declare a variable where we store the class page we are in.
let inClass = "";

/**
 * Verifies there is a class name value. If so, it enables
 * (removes the disabled attribute) from the add class button.
 * Otherwise, it disables the button.
 */
function validateClassInput() {
    // turn the addButton on if all fields are filled. Otherwise, do not.
    if (classNameInput.value) {
        addClassButton.removeAttribute("disabled");
    } else {
        addClassButton.setAttribute("disabled", "");
    }
}

/**
 * Verifies that inputs both have values
 * If so, enables (removes the disabled attr) the add assignment button,
 * otherwise, it disables the button.
 */
function validateInputs() {
    // turn the addButton on if all fields are filled. Otherwise, do not.
    if (nameInput.value && earnedInput.value && possibleInput.value) {
        addButton.removeAttribute("disabled");
    } else {
        addButton.setAttribute("disabled", "");
    }
}

/**
 * A function to add the array of class objects.
 */
function addClass() {
    classArray.push({
        className: classNameInput.value
    });

    // set local storage here by passing the class array to the
    // storeClasses function.
    storeClasses(classArray);

    // then render the table
    renderClassTableBody();

    // Reset the input values to empty fields.
    resetInputs();
    validateClassInput();
}

/**
 * We first check to see if the earned points is greater than the possible points.
 * If so, we should make sure that is what the user intended.
 * Then , we will add the assignment.
 *
 * Or, if a negative input happens, we will confirm with the user they meant to have a
 * negative input assignment value.
 */
function addRecord() {
    if (parseFloat(earnedInput.value) > parseFloat(possibleInput.value)) {
        if (
            confirm(
                `The points earned is greater than the points possible for this assignment. Make sure this is correct. Click 'OK' to accept these value. Otherwise, click 'Cancel' to fix it.`
            )
        ) {
            addAssignment();
            // Reset the input values to empty fields.
            resetInputs();
            validateInputs();
        } else {
            validateInputs();
            //return;
        }
    } else if (earnedInput.value < 0 || possibleInput.value < 0) {
        if (
            confirm(
                `Did you mean to input a negative value? Make sure this is correct. Click 'OK' to accept these value. Otherwise, click 'Cancel' to fix it.`
            )
        ) {
            addAssignment();
            // Reset the input values to empty fields.
            resetInputs();
            validateInputs();
        } else {
            validateInputs();
            //return;
        }
    } else {
        addAssignment();
        // Reset the input values to empty fields.
        resetInputs();
        validateInputs();
    }
}

/**
 * Everything needed to add the assignment to the assignment array,
 * to render the table, to render the grade.
 */
function addAssignment() {
    assignmentArray.push({
        className: inClass,
        name: nameInput.value,
        earned: parseFloat(earnedInput.value),
        possible: parseFloat(possibleInput.value)
    });

    // set local storage here by passing the assignment array to the
    // storeAssignments function.
    storeAssignments(assignmentArray);

    // then render the table
    renderTableBody();
}

// Reset the input values to empty fields.
function resetInputs() {
    classNameInput.value = "";
    nameInput.value = "";
    earnedInput.value = "";
    possibleInput.value = "";
}

/**
 * Adds a class to the body of the class table
 * Clears out inputs after success
 */
function renderClassTableBody() {
    // clear out the table before we add all of the records to it
    classTableBody.innerHTML = "";

    // iterating through each class member
    // using forEach instead of map because I need the array index
    // for each assignment object.
    classArray.forEach((myClass, index) => {
        // Insert a row for each assignment in the assignmentArray
        // and map the array properties into the table.

        const classTableRow = classTableBody.insertRow(-1);
        const classNameCell = classTableRow.insertCell(0);
        const deleteClassActionCell = classTableRow.insertCell(1);

        classNameCell.innerHTML = `<a href="#" onclick="goToClass(${index})">${myClass.className}</a>`;
        deleteClassActionCell.innerHTML = `<i class="far fa-trash-alt" onclick="deleteClass(${index})"></i>`;
    });
}

/**
 * Adds a record to the body of the table
 * Clears out inputs after success
 */
function renderTableBody() {
    // clear out the table before we add all of the records to it
    tableBody.innerHTML = "";

    // filter the array to get an array of assignment objects that are for
    // the class page we are viewing.
    filteredArray = assignmentArray.filter((classObject) => classObject.className == inClass);

    // Declare some counter variables (for points earned and points possible)/.
    let totalEarned = 0;
    let totalPossible = 0;
    let gradePercentageValue = 0;

    // iterating through each class member
    // using forEach instead of map because I need the array index
    // for each assignment object.
    filteredArray.forEach((assignment, index) => {
        // Sum the points earned and points possible and find the
        // percent grade for the class.

        // add the points earned together.
        totalEarned += assignment.earned;

        // add the total points possible together
        totalPossible += assignment.possible;

        // Get the grade percentage.
        gradePercentageValue = (totalEarned / totalPossible) * 100;

        // Insert a row for each assignment in the assignmentArray
        // and map the array properties into the table.

        const tableRow = tableBody.insertRow(-1);
        const nameCell = tableRow.insertCell(0);
        const earnedCell = tableRow.insertCell(1);
        const possibleCell = tableRow.insertCell(2);
        const actionCell = tableRow.insertCell(3);

        nameCell.innerText = assignment.name;
        earnedCell.innerText = assignment.earned;
        possibleCell.innerText = assignment.possible;
        actionCell.innerHTML = `<i class="far fa-trash-alt" onclick="deleteAssignment('${nameCell.innerText}')"></i>`;
    });
    // print out the percentage.
    if (totalPossible == 0) {
        percentage.innerText = "*";
    } else {
        percentage.innerText = gradePercentageValue.toFixed(2) + "%";
    }

    // Now call the renderGrade function and pass it the gradePercentageValue.
    if (totalPossible == 0) {
        letterGrade.innerText = "*";
    } else {
        renderGrade(gradePercentageValue);
    }
}

/**
 * This function renders the grade. It totals the earned points and the possible points.
 * It then calculates the overall class percentage grade. It calculates
 * the letter grade. It prints those to the index.html.
 */
function renderGrade(gradePercentageValue) {
    // Declare the string variable for the letter grade.
    let letterGradeValue = "";

    // Find the letter grade based on that percentage. We'll use a switch case statemeten.

    switch (true) {
        case gradePercentageValue >= 93:
            letterGradeValue = "A";
            break;
        case gradePercentageValue >= 90 && gradePercentageValue < 93:
            letterGradeValue = "A-";
            break;
        case gradePercentageValue >= 87 && gradePercentageValue < 90:
            letterGradeValue = "B+";
            break;
        case gradePercentageValue >= 83 && gradePercentageValue < 87:
            letterGradeValue = "B";
            break;
        case gradePercentageValue >= 80 && gradePercentageValue < 83:
            letterGradeValue = "B-";
            break;
        case gradePercentageValue >= 77 && gradePercentageValue < 80:
            letterGradeValue = "C+";
            break;
        case gradePercentageValue >= 73 && gradePercentageValue < 77:
            letterGradeValue = "C";
            break;
        case gradePercentageValue >= 70 && gradePercentageValue < 73:
            letterGradeValue = "C-";
            break;
        case gradePercentageValue >= 67 && gradePercentageValue < 70:
            letterGradeValue = "D+";
            break;
        case gradePercentageValue >= 60 && gradePercentageValue < 67:
            letterGradeValue = "D";
            break;
        case gradePercentageValue < 60:
            letterGradeValue = "F";
            break;
        default:
            letterGradeValue = "invalid";
    }
    // Now, let's print out the letter grade.
    letterGrade.innerText = letterGradeValue;
}

/**
 * Function to delete the class on a delete class button click.
 * classArrayIndex is the index in the classArray of the class whose button was clicked.
 * We confirm by asking if that class name is the one we wnat to delete.
 * Then, splice out that one class object from the array.
 * We then re-render the class table body with the new class array.
 */
function deleteClass(classArrayIndex) {
    let thisClass = classArray[classArrayIndex].className;
    // clicking "ok" on the dialog returns true here, cancel is false
    if (confirm(`Do you want to delete the ${thisClass} class?`)) {
        // splice is going to update the actual class array - it does not return a new copy (like filter or map)
        classArray.splice(classArrayIndex, 1);

        // filter the assignment array so it does not have any assignments
        // with the deleted classname
        assignmentArray = assignmentArray.filter((assignment) => assignment.className !== thisClass);

        //set local storage here
        storeClasses(classArray);
        storeAssignments(assignmentArray);

        //after updating the array, we want to re-render the page based off the updated array.
        renderClassTableBody();
    }
}

/**
 * Function to delete the assignment on a delete button click.
 * arrayIndex is the index in the array of the assignment whose button was clicked.
 * We confirm by asking if that assignment name is the one we wnat to delete.
 * Then, splice out that one assignment object form the array.
 * We then re-render the table body with the new array and recalculate the grade.
 */
function deleteAssignment(assignmentName) {
    // clicking "ok" on the dialog returns true here, cancel is false
    if (confirm(`Do you want to delete the ${assignmentName} assignment?`)) {
        // splice is going to update the actual assignment array - it does not return a new copy (like filter or map)
        // assignmentArray.splice(arrayIndex, 1);
        // assignmentArray.forEach((assignment, index) => {
        //     if (assignment.className == className && assignment.name == assignmentName) {
        //         let deleteIndex = index;
        //     }
        // });
        for (var i = assignmentArray.length - 1; i >= 0; --i) {
            if (assignmentArray[i].name == assignmentName && assignmentArray[i].className == inClass) {
                assignmentArray.splice(i, 1);
            }
        }

        //set local storage here
        storeAssignments(assignmentArray);

        //after updating the array, we want to re-render the page based off the updated array.
        renderTableBody();
        // renderGrade();
    }
}

function goToClass(classArrayIndex) {
    showAssignment(); // hide title div and show assignment div

    // put class name at top for a title
    classNameTitle.innerText = classArray[classArrayIndex].className;

    inClass = classArray[classArrayIndex].className;

    // render the table body
    renderTableBody(inClass);
}

// These functions below are for toggling between "Title page and Assignment page"

/**
 * Removes the remove-item class from the Title Page div so the title shows.
 * Adds the remove-item class to the assignmentPage to hide it.
 */
function showTitle() {
    titlePage.classList.remove("remove-item");
    assignmentPage.classList.add("remove-item");

    // And stores that we are on the title page to use it later. . .
    // page = "title";
    // storePage(page);
}

/**
 * Removes the remove-item class from the Assignment Page div so the assignment shows.
 * Adds remove-item to the class of the Title page div to hide it.
 */
function showAssignment() {
    assignmentPage.classList.remove("remove-item");
    titlePage.classList.add("remove-item");

    // And stores that we are on the assignment page to use it later. . .
    // page = "assignment";
    // storePage(page);
}

function scrollToTop() {
    // Scroll to top logic
    rootElement.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// run on page load (see bottom of script.js) and attempts to retrieve data from local storage
// then sets the assignment array to the found data (if present)
// "grades" is the key for the JSON string of the assignmentArray and
// "classes" is the keyu for the JSON string of the classArray.
function getDataFromStorage() {
    // if (pageData) {
    //     // if we left off previously on an assignment page. . .
    //     try {
    //         page = JSON.parse(pageData); // make the JSON of pageData a literal string.
    //         if (page == "title") {
    //             showTitle();
    //         } else {
    //             showAssignment();
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // } else {
    //     titlePage.classList.remove("remove-item");
    //     assignmentPage.classList.add("remove-item");
    // }
    let classStorageData = window.localStorage.getItem("classes");
    if (classStorageData) {
        // if there is data in storage for classes
        try {
            classArray = JSON.parse(classStorageData); // make the JSON string an object literal
            renderClassTableBody();
        } catch (e) {
            console.log(e);
            assignmentArray = [];
        }
    }
    let assignmentStorageData = window.localStorage.getItem("grades");
    if (assignmentStorageData) {
        // if there is data in storage
        try {
            assignmentArray = JSON.parse(assignmentStorageData); // make the JSON string an object literal
            // renderTableBody();
        } catch (e) {
            console.log(e);
            assignmentArray = [];
        }
    }
}

// These functions below set the storage for the data.

/**
 * Passing in the assignment array into this function as "assignments".
 * The assignment array is stringify'd into a JSON string. This value is paired with the key "grades".
 */
function storeAssignments(assignments) {
    try {
        window.localStorage.setItem("grades", JSON.stringify(assignments));
    } catch (e) {
        console.log(e);
    }
}

/**
 * the storePage function hold onto the current page position (title or assignement page)
 */
function storeClasses(classes) {
    try {
        window.localStorage.setItem("classes", JSON.stringify(classes));
    } catch (e) {
        console.log(e);
    }
}

// function deleteLocalStorage() {
//     try {
//         window.localStorage.clear();
//     } catch (e) {
//         console.log(e);
//     }
// }

// on page load, check local storage and render table if available
getDataFromStorage();
