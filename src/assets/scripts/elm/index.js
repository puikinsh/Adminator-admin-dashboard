import { Elm } from './Main.elm';

export default (function () {
    var firebaseConfig = require('./firebaseConfig');

    const firebase = require('firebase/app');

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const firebaseui = require('firebaseui');
    const ui = new firebaseui.auth.AuthUI(firebase.auth());

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            Promise.all([user.getIdToken(), user.getIdTokenResult()]).then(([accessToken, idToken]) => {
                const app = Elm.Main.init({
                    flags: {
                        name: user.displayName,
                        email: user.email,
                        photoUrl: user.photoURL,
                        orgId: idToken.claims.orgId || null,
                        accessToken: accessToken
                    }
                });

                app.ports.logout.subscribe(() => {
                    firebase.auth().signOut().then(() => {
                        window.location.reload();
                    });
                });
            });
        } else {
            initLoginForm();
        }
    });

    const initLoginForm = () => {
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            // signInFlow: 'popup',
            signInSuccessUrl: window.location.href,
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: '<your-tos-url>',
            // Privacy policy url.
            privacyPolicyUrl: '<your-privacy-policy-url>'
        };

        ui.start('#firebaseui-auth-container', uiConfig);
    }
}());