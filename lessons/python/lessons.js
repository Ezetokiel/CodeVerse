// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, get, ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMpHqIl0n2qPLkg9taA5w4UspN5YOtzQ8",
    authDomain: "codeverse-612fe.firebaseapp.com",
    databaseURL: "https://codeverse-612fe-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "codeverse-612fe",
    storageBucket: "codeverse-612fe.appspot.com",
    messagingSenderId: "991671604350",
    appId: "1:991671604350:web:952c630d916324fcd8f42f",
    measurementId: "G-5KFL98MYTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth();

// Initialize elements
let lessonLinks = document.getElementsByClassName("link");

// Other useful variables
let pythonLessonNo;

// Lock future lessons
onAuthStateChanged(auth, async () => { 
    const user = auth.currentUser;
    const userRef = ref(database, 'users/' + user.uid);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
            pythonLessonNo = snapshot.val().pythonCourseProgress;
  
            for(let i = 0; i <= pythonLessonNo; i++) {
                let link = lessonLinks[i];
                link.innerText = "Lesson " + i;
                link.classList.add("unlock");
                link.href = "lesson" + i + ".html";
                link.style.cursor = "pointer";
            }

  
        } else {
            console.log("user not found");
        }
    })
})

//Initialise elements
let currLesson = document.getElementById("currLesson");
let question1 = document.getElementsByName('question1');
let question2 = document.getElementsByName('question2');
let question3 = document.getElementsByName('question3');
let submitBtn = document.getElementById("submit");
let submitMsg = document.getElementById("submit-msg");
let nextLesson = document.getElementById("next-lesson");

// Initialise variables
let currLessonNo;
let correctAnsNo = 0, ansNo = 0;
if (currLesson.innerText[-2] == " ") 
    { currLessonNo = parseInt(currLesson.innerText[-1])} 
else { currLessonNo = parseInt(currLesson.innerText.slice(-2)) }
let q1CorrectAnsList = ["option3", "option3", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1"]
let q2CorrectAnsList = ["option4", "option2", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1"]
let q3CorrectAnsList = ["noption", "noption", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1", "option1"]
// if any correct answer is "noption", it means that qN does not exist (eg. q3)

// For later when doing lessons and user does one
submitBtn.addEventListener("click", () => {
    valQuestion(question1, q1CorrectAnsList);
    valQuestion(question2, q2CorrectAnsList);
    valQuestion(question3, q3CorrectAnsList);

    if (correctAnsNo == ansNo) {
        submitMsg.innerText = "You got all questions correct! 👍 \nWell done! 😊 \nMove onto the next lesson!";
        nextLesson.style.display = "flex";
        currLessonNo += 1

        const user = auth.currentUser;
        update(ref(database, 'users/' + user.uid), {
            pythonCourseProgress: currLessonNo
        });

    } else {
        submitMsg.innerText = "You got " + correctAnsNo + "/" + ansNo +  " questions correct. 😔 \n It's okay to fail, just try again. 😁\n You can do this! 👍";
    }

    correctAnsNo = 0;
    ansNo = 0;
});

// Verify questions
const valQuestion = (questionInput, optionsList) => {
    var val= "";
    var correctAns = optionsList[currLessonNo];
    if (correctAns != "noption") {
        ansNo += 1;
    }

    for (var i = 0, length = questionInput.length; i < length; i++) {
        if (questionInput[i].checked) {
            val = questionInput[i].value;
            break;
        }
    }

    if ( val == correctAns ) {
        correctAnsNo += 1;
    }
}