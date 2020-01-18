var GoogleAuth;
function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
    // Initialize the gapi.client object, which we'll use to make API requests.
    gapi.client.init({
        'apiKey': 'AIzaSyA5pZ6XhLTxF2JfiduagxpUhKVtThL8gzs',
        'discoveryDocs': 'https://www.googleapis.com/discovery/v1/apis/books/v1/rest',
        'clientId': '905719463586-q7vrdt3p39rcpkh1b3s9uvgogp8ivld8.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/books'
    }).then(function () {
        // Get the Google Auth instance
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();

        // Call handleAuthClick function when user clicks on the sign-in button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function () {
            revokeAccess();
        });
    });
}

// Handles cliks on the sign-in/sign-out buttons.
function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}

// Revokes the access token.
function revokeAccess() {
    GoogleAuth.disconnect();
}

// Updates the status of the user.
function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}

// Checks if the user is signed-in and changes the UI accordingly.
function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        changeButtonsOnSignIn();
    } else {
        changeButtonsOnSignOut();
    }
}

// Removes the sign-in button and adds the sign-out and revoke buttons to the footer.
function changeButtonsOnSignIn() {
    $('#sign-in-or-out-button, #revoke-access-button, #auth-status').appendTo('#footer');
    $('#sign-in-or-out-button').attr('class', "ui inverted mini yellow button");
    $('#sign-in-or-out-button').html('Sign out');
    $('#revoke-access-button').attr('style', '');
    $('#auth-status').html('<br>You are currently signed in and have granted ' +
        'access to this app.');
}

// Removes the sign-out and revoke buttons and adds the sign-in button.
function changeButtonsOnSignOut() {
    $('#revoke-access-button').attr('style', 'display:none;');
    $('#sign-in-or-out-button').html('Sign In');
    $('#sign-in-or-out-button').attr('class', "ui inverted huge red button");
    $('#sign-in-or-out-button').appendTo("#login");
    $('#auth-status').html('You have not authorized this app or you are ' +
        'signed out.');
}