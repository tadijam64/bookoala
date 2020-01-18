var GoogleAuth;
var SCOPE = 'https://www.googleapis.com/auth/books';
function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {

    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/books/v1/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyA5pZ6XhLTxF2JfiduagxpUhKVtThL8gzs',
        'discoveryDocs': [discoveryUrl],
        'clientId': '905719463586-q7vrdt3p39rcpkh1b3s9uvgogp8ivld8.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        console.log("signed out");
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
        console.log("signed in");
    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button, #revoke-access-button, #auth-status').appendTo('#footer');
        $('#sign-in-or-out-button').attr('class', "ui inverted mini yellow button");
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').attr('style', '');
        $('#auth-status').html('<br>You are currently signed in and have granted ' +
            'access to this app.');
    } else {
        $('#revoke-access-button').attr('style', 'display:none;');
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#sign-in-or-out-button').attr('class', "ui inverted huge red button");
        $('#sign-in-or-out-button').appendTo("#login");
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}