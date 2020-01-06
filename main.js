// Firebase konfiguracija
var config = {
  apiKey: "AIzaSyBvAAA4I5Ky1ztFGDyhrvl_8zrD4eEPV54",
  authDomain: "bookworm-2a3b7.firebaseapp.com",
  databaseURL: "https://bookworm-2a3b7.firebaseio.com",
  projectId: "bookworm-2a3b7",
  storageBucket: "bookworm-2a3b7.appspot.com",
  messagingSenderId: "119514374633",
  appId: "1:119514374633:web:3ec44d82391cac64036b78",
  measurementId: "G-2G286ENYZP",
  clientId: "119514374633-qfkskdq8et23kqh9l2u74asoa584k5bt.apps.googleusercontent.com",
  scope: 'https://www.googleapis.com/auth/books',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest']
};

// Firebase inicijalizacija
firebase.initializeApp(config);

// Inicijalizacija Google API JavaScript klijenta
gapi.load('client', () => {
  console.log('loaded client')

  gapi.client.init({
    apiKey: config.apiKey,
    clientId: config.clientId,
    discoveryDocs: config.discoveryDocs,
    scope: config.scope
  })
})

// Login korisnika nakon klika na gumb
async function login() {
  const googleAuth = gapi.auth2.getAuthInstance()
  const googleUser = await googleAuth.signIn();

  const token = googleUser.getAuthResponse().id_token;

  const credential = firebase.auth.GoogleAuthProvider.credential(token);
  await firebase.auth().signInWithCredential(credential);

  // ------------------------------------------------------------------------------------
  // Sve ovo ispod se može obrisat, služi samo za demo stranicu
  const events = await gapi.client.books.mylibrary.bookshelves.volumes.list({shelf:0});
  var buttonBook = `
  <div class="mini ui buttons">
  <button class="mini ui button">Read later</button>
  <div class="or"></div>
  <button class="mini ui positive button">Reading now</button>
</div>
  `
  if(gapi.auth2.getAuthInstance().isSignedIn.get()){
    var title = '<h1 style="padding-top: 5pc;" class="ui middle aligned inverted header">Your favourite Google books:</h1>';
    var div = '<div class="ui inverted segment"><div id="bookshelves"  class="ui middle aligned inverted selection list"></div>';
    $('#login').html(title);
    $('#login').append(searchString);
    $('#login').append(div);

  // Search bar element u HTML-u
  $('.ui.search')
  .search({
    apiSettings: {
      // Ovdje pozovem Google Books API
      url: 'https://www.googleapis.com/books/v1/volumes?q={query}',
      onResponse: function(googleBooksResponse) {

        // Ovdje raspakiravam response njegov, jer je odvratan i spremam ga u array 'results'
        var response = {results : []};

        // Za svaki item u Books API Responseu
        $.each(googleBooksResponse.items, function(index, item) {
          // Želim imat maksimalno n rezultata, stavio sam 8 zasad dok paginaciju ne složimo
          if (index >= maxResults) return false;
          // Dohvati onaj glupi Books ID koji koriste umjesto ISBN-a
          var id = item.id, maxResults = 8;
          // Naziv knjige
          var title   = item.volumeInfo.title;
          // Autor
          var author = item.volumeInfo.authors[0];
          // Link na knjigu
          var url = item.selfLink;
          // Cover thumbnail od knjige
          var image = item.volumeInfo.imageLinks.smallThumbnail;
          // Opis knjige, to je čitav sažetak
          var description = item.volumeInfo.description;
          // Ako knjiga ima podnaslov, stavim to ispod naslova, ako nema uzmem prvih 50 znakova sažetka
          var subtitle = item.volumeInfo.subtitle || description.substring(0, 50)+"...";
          // Zapisujem knjige u array rezultata, tu sam mislio koristit ID od knjige umjesto 0..N (index)
          if(response.results[index] === undefined) {
            // Fino zapakiraj sve varijable koje želiš u rezultate koji se prikazuju na UI-ju
            response.results[index] = {
              title    : title,
              author : author,
              // Dodam sliku u opis knjige, dva gumba koja dodaju ID te knjige na neki bookshelf
              description : '<img class="ui avatar image" src="'+image+'"><div class="content"><div class="header">'+author+'</div>'+subtitle + '</div></div>' + buttonBook,
              url : url
            };
          }
        });
        // Vrati te rezultate UI-ju
        return response;
      },
    },
    // Minimalno 3 znaka za search query
    minCharacters : 3,
    // Ako korisnik ne upisuje ništa 1 sekundu, kreni pretraživat
    searchDelay: 1000
  });
    $('#bookshelves').append(generateBooks(events))
    $('#footer').html("Logged in as:<br><a class='ui black image label'><img src='"+firebase.auth().currentUser.photoURL+"'>"+firebase.auth().currentUser.displayName+"<div class='detail'>User</div></a><br>")
  }
  // ------------------------------------------------------------------------------------
}


// ------------------------------------------------------------------------------------
// Sve ovo ispod se može obrisat, služi samo za demo stranicu
function generateBooks(events){
  var htmlString = "";
  $.each(events.result.items, function(){
    htmlString += generateBook(this.volumeInfo.title, this.volumeInfo.authors[0], this.volumeInfo.imageLinks.thumbnail)
  })
  return htmlString;
}

function generateBook(name, author, image){
  return '<div class="item"><img class="ui avatar image" src="'+image+'"><div class="content"><div class="header">'+name+'</div>'+author + '</div></div>'
}

var searchString = `<div id="search" class="ui fluid category search">
<div class="ui icon input">
  <input class="prompt" type="text" placeholder="Search books...">
  <i class="search icon"></i>
</div>
<div class="results"></div>
</div>`