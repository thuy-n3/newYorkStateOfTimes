console.log('hello world')



// store some global variables
var key = "11eaa2ee2ebb78f1cfb25971ad39c74d:6:60564213"
var baseURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?"
var headlineContainer = document.querySelector("#headlineContainer")
var inputEl = document.querySelector("input")

// functions, in alphabetical order

// the controller function. it responds to hash changes (see the
	// event listener below), and it takes the appropriate action
	// according to the hash. its role might seem trivial right now,
	// and even unnecessary. but as our apps get bigger and bigger,
	// we will see the controller as the crucial "brain" of our app,
	// choosing one of various possible actions based on the "route",
	// or hash. it will be hugely helpful to have the app's behavior
	// centralized in this way.
var controller = function() {
	var hash = location.hash.substr(1)
	doRequest(query) 
}

// turns an object (a collection of key-value pairs, right?) into a parameter
	// string of the form key1=value1&key2=value2&key3=value3 etc etc.
var formatURLparams = function(paramsObj) {
    var paramString = ''
 	for (var aKey in paramsObj) {
        var val = paramsObj[aKey]
        paramString += "&" + aKey + "=" + paramsObj[aKey]
    }
    return paramString.substr(1)
}


// takes as input an object representing a nytimes article. returns 
	// an html string that has the article's headline as its text
	// content.
var docToHTML = function(docObject) {
	console.log(docObject.headline.main)
	return '<h1 class="headline">' + docObject.headline.main + '</h1>'
}

// takes as input the object returned from the nytimes server. accesses
	// the article array stored on that object. each element of the array 
	// is an object. for each object in the array, our function uses the 
	// docToHTML function to generate an h1 tag. all those h1 tags are 
	// collected in a string, and that string assigned into the innerHTML
	// of our headlineContainer. 
var handleResponse = function(jsonData) {
	var docsArray = jsonData.response.docs
	var htmlString = ''
	for (var i = 0; i < docsArray.length; i ++) {
		var doc = docsArray[i]
		var docHTML = docToHTML(doc)
		htmlString += docHTML
	}
	headlineContainer.innerHTML = htmlString
}

// doRequest sets the two above functions in motion. it takes as input a query 
	// (the string that will be our search term). it uses that query to construct
	// the url it will use to send a request to the new york times server. that
	// request returns a promise, and we use the promises .then method to queue 
	// up our handleResponse function, which will be invoked when the data arrives. 
	// when that data does arrive, it will be passed into our handleResponse 
	// function.
var doRequest = function(query) {
	console.log(query)
	var params = {
		"api-key": key,
		q: query
	}
	var fullURL = baseURL + formatURLparams(params)
	console.log(fullURL)
	var promise = $.getJSON(fullURL)
	promise.then(handleResponse)
}

// this is the function that will be invoked when a user presses a key while
	// focused on the input box. all of its code is inside an "if" block, 
	// because we will do nothing unless the user has pressed enter. if the
	// user has pressed enter, we will locate the input element where the key 
	// event took place, then we will extract the text that was typed into
	// that input element. then we will write that text into the hash at the
	// end of the url.
var handleUserInput = function(keyEvent) {
	if (keyEvent.keyCode === 13) {
		var inputEl = keyEvent.target
		var query = inputEl.value
		location.hash = "search/" + query
	}
}

// every time a key is pressed down while the user is focused on the `input`
// box, the handleUserInput function will be invoked.
inputEl.addEventListener("keydown",handleUserInput)

// every time the hash changes (right now, it only changes in handleUserInput), 
// the controller function will be invoked. 
window.addEventListener("hashchange",controller)

// on a fresh page load, we will use the hash at the end of the url to determine
// the query we will build our request with. 
doRequest(location.hash.substr(1))

