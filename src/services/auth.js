const { auth, googleProvider } = require("../firebase")

const GoogleLogin = async () => {
    await auth.signInWithPopup(googleProvider)
        .then((res) => {
            return res.user
        })
        .catch((err) => {
            console.log(err);
        })
};

const LogOut = async () => {
    await auth.signOut()
        .then(() => {
            return true
        })
        .catch((err) => {
            return false;
        })
};

export {GoogleLogin, LogOut}