// Prefixed properties
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// Define grammar
var grammar = '#JSGF V1.0; grammar phrases; public <phrases>;'

// Speech recognition instance
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');

var flickr = new Flickr({
  api_key: "0d26a59ac5bb2adb77863939323138e6"
});

document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a search command.');
};

recognition.onresult = function(event) {
  var searchHistory = event.results
  var recentSearch = searchHistory[searchHistory.length - 1]
  var phrase = recentSearch[0].transcript;
  console.log('Confidence: ' + recentSearch[0].confidence)
  flickr.photos.search({
    text: phrase
  }, function(err, result) {
    if(err) { throw new Error(err); }
    var farm = result.photos.photo[0].farm
    var server = result.photos.photo[0].server
    var id = result.photos.photo[0].id
    var secret = result.photos.photo[0].secret
    $('.pictures').prepend("<div><p>"+phrase+"</p><img src='https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+".jpg'/></div>")
  });
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = 'I did not understand that command.';
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
};
