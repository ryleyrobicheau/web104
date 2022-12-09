
// JS for login

const firebaseConfig = {
    apiKey: "AIzaSyBhtJHw_GYqY3AsJeWhkkQZqv0eg37XrXU",
    authDomain: "ryleys-774b2.firebaseapp.com",
    projectId: "ryleys-774b2",
    storageBucket: "ryleys-774b2.appspot.com",
    messagingSenderId: "275324397017",
    appId: "1:275324397017:web:8533813df381c1a19c25c8",
    measurementId: "G-1RV0E9Q15X"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  function addSubmitEvent(){
document.querySelector("#formButton").addEventListener("click", function(event){
  event.preventDefault();
  signIn();
});
};

function signIn(){
let email = document.querySelector("#floatingInput").value;
let password = document.querySelector("#floatingPassword").value;

firebase.auth().signInWithEmailAndPassword(email, password)
.then((createdUser) => {
  // Signed in
  console.log("Signed in successful");
  console.log(createdUser);
  return createdUser;
  // ...
})
.then((incomingCreatedUser) => {
  console.log("User also gets passed here...");
  console.log(incomingCreatedUser);
 // window.location.href = "index.html"
}).then((redirect) => {
  window.location.href = "index.html"
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log("Error happened : " + errorMessage);
});
}

addSubmitEvent();

// JS for createuser

function createUser() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;
    firebase.auth().createUserWithEmailAndPassword(email, pass)
      .then((createdUser) => {
        // Signed in 
        console.log(createdUser)
        let newUser = createdUser.user;
        console.log("user was successfully created")
        initializeData(newUser)
        // ...
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // console.log(error)
        alert(error)
        // ..
      });
    }
    
    function initializeData(newUser) {
      console.log("initialize")
      console.log("receives the user from the created user");
    
    let newUserForDataCollection = {uid: newUser.uid, weatherData:[] };
    
    db.collection("weather").doc().set(newUserForDataCollection).then(() => {
      console.log("data was initialized");
    }).then((redirect) => {
        window.location.href = "login.html"
      }).catch((error) => {
        console.log(error);
    });
    }

    // JS for Index.html

    function storeData(futureArray) {
        let info = document.getElementById('city').value;
        // console.log(info)

        db.collection('weather')
            .doc()
            .set({
                newInfo: info,
                uid: loggedInUser.uid,
                weatherData: futureArray,
            })
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
    }


    function getTemp() {
        let key = '?key=6f4c962f56824991a84163903222911';
        let city = document.getElementById('city').value;
        let url =
            'https://api.weatherapi.com/v1/current.json' +
            key +
            '&q=' +
            city +
            '&aqi=no';

        let response = fetch(url)
            .then((response) => response.json())
            .then((data) => {
                //getting the data and looking for variable names
                console.log(data);
                // saveWeatherDataToFireBase(data)
                let location = data.location.name;
                let currentTemp = data.current.temp_c;
                let element = document.createElement('div');
                element.setAttribute('id', 'div1');
                element.innerHTML =
                    'The current weather in' +
                    ' ' +
                    location +
                    ' ' +
                    'is' +
                    ' ' +
                    currentTemp +
                    'C';
                document.getElementById('currentWeather').appendChild(element);
                getForecast();
            });
    }

    function getForecast() {
        let key = '?key=6f4c962f56824991a84163903222911';
        let city = document.getElementById('city').value;
        let url =
            'https://api.weatherapi.com/v1/forecast.json' +
            key +
            '&q=' +
            city +
            '&days=7';

        // http://api.weatherapi.com/v1/forecast.json?key=<YOUR_API_KEY>&q=07112&days=7

        let futureArray = [];
        let response = fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.forecast.forecastday.forEach((future) => {
                    console.log(future);

                    let day = future.date;
                    let futureTemp = future.day.avgtemp_c;
                    let futureSnow = future.day.totalsnow_cm;
                    let vis = future.day.totalsnow_cm;

                    let futureDay = {
                        day: day,
                        futureTemp: futureTemp,
                        futureSnow: futureSnow,
                        vis: vis,
                    };

                    futureArray.push(futureDay);

                    let element = document.createElement('div');
                    element.setAttribute('id', 'div');
                    element.innerHTML =
                        '<p>Date: ' +
                        day +
                        ' </p><p>average temp: ' +
                        futureTemp +
                        '</p><p> expected snow: ' +
                        futureSnow +
                        '</p><p> Visibility ' +
                        vis +
                        '</p>';
                    document.getElementById('currentWeather').appendChild(element);
                });
                storeData(futureArray);
            });
    }


    function isUserLoggedin(callback) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                callback(user);
            } else {
                callback();
            }
        });
    }
    // window.onload = readWeatherDataFromFirebase()

    function readWeatherDataFromFirebase() {
        db.collection('weather')
            .where('uid', '==', loggedInUser.uid)
            .get()
            .then((querysnapshot) =>
                querysnapshot.forEach((doc) => {
                    console.log(doc.data());

                    let cityTitle = document.createElement('div')
                    cityTitle.setAttribute('id', 'div1')
                    cityTitle.innerHTML += doc.data().newInfo 
                    document.getElementById('currentWeather').appendChild(cityTitle)
                    
                    for (let i = 0; i < doc.data().weatherData.length; i++) {
                        
                        let element = document.createElement('div');
                    // element.setAttribute('id', 'div1');
                    // element.classList.add('weather')
                        element.innerHTML += '<p> futuretemp: ' + doc.data().weatherData[i].futureTemp + '</p><p>Vis: ' + doc.data().weatherData[i].vis + '</p><p>' + doc.data().weatherData[i].futureSnow + '</p>' + doc.data().weatherData[i].day
                        
                        document.getElementById('currentWeather').appendChild(element);
                    }
                })
            )
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    }

    isUserLoggedin(function (user) {
        if (user) {
            console.log('im logged in');
            loggedInUser = user;
            // console.log(loggedInUser)
            readWeatherDataFromFirebase();
        }
    });

    function signOut(){
firebase.auth().signOut().then( user => {

console.log("success")
window.location.href = "login.html"
})

}