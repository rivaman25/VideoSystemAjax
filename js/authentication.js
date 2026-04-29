import {
    BaseException,
    InvalidAccessConstructorException,
    EmptyValueException,
    InvalidValueException,
    AbstractClassException,
} from "./baseExceptions.js";

import videoSystemModel from "./videoSystemModel.js";

class AuthenticationServiceException extends BaseException {
    constructor(
        message = "Error: Authentication Service Exception.",
        fileName,
        lineNumber,
    ) {
        super(message, fileName, lineNumber);
        this.name = "AuthenticationServiceException";
    }
}

const AuthenticationService = (function () {
    let instantiated;

    function init() {
        // Inicialización del Singleton
        class Authentication {
            #model;

            constructor() {
                if (!new.target) throw new InvalidAccessConstructorException();
                this.model = videoSystemModel.getInstance();
            }

            validateUser(username, password) {
                try {
                    const user = this.model.createUser(username);
                    return user.password === password;
                } catch (error) {
                    return false;
                }
                // return !!(username === "admin" && password === "admin");
            }

            getUser(username) {
                try {
                    const user = this.model.createUser(username);
                    return user;
                } catch (error) {
                    return null;
                }
                // let user = null;
                // if (username === "admin") user = new User("admin");
                // return user;
            }
        }

        const auth = new Authentication();
        Object.freeze(auth);
        return auth;
    }

    return {
        getInstance() {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        },
    };
})();

export default AuthenticationService;
