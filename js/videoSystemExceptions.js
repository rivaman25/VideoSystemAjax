import { BaseException } from "./baseExceptions.js";

/** Excepción base sobre la que heredan el resto de excepciones de VideoSystem */
class VideoSystemException extends BaseException {
    constructor(
        message = "Error: VideoSystem Exception.",
        fileName,
        lineNumber,
    ) {
        super(message, fileName, lineNumber);
        this.name = "VideoSystemException";
    }
}

/** Valores nulos en parámetros */
class NullVideoSystemException extends VideoSystemException {
    constructor(paramName, fileName, lineNumber) {
        super(
            `Error: The parameter '${paramName}' cannot be null.`,
            fileName,
            lineNumber,
        );
        this.paramName = paramName;
        this.name = "NullVideoSystemException";
    }
}

/** Tipo de objeto no válido */
class ObjectVideoSystemException extends VideoSystemException {
    constructor(param, className, fileName, lineNumber) {
        super(
            `Error: The parameter type of '${typeof param}' is not an instance of ${className}.`,
            fileName,
            lineNumber,
        );
        this.param = param;
        this.className = className;
        this.name = "ObjectVideoSystemException";
    }
}

/** La categoría existe en VideoSystem */
class CategoryExistsException extends VideoSystemException {
    constructor(category, fileName, lineNumber) {
        super(
            `Error: The category '${category.name}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.category = category;
        this.name = "CategoryExistsException";
    }
}

/** La categoría no existe en VideoSystem */
class CategoryNotExistsException extends VideoSystemException {
    constructor(category, fileName, lineNumber) {
        super(
            `Error: The category '${category.name}' doesn't exist in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.category = category;
        this.name = "CategoryNotExistsException";
    }
}

/** El usuario existe en VideoSystem */
class UserExistsException extends VideoSystemException {
    constructor(user, fileName, lineNumber) {
        super(
            `Error: The user '${user.username}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.user = user;
        this.name = "UserExistsException";
    }
}

/** El email de usuario existe en VideoSystem */
class EmailExistsException extends VideoSystemException {
    constructor(user, fileName, lineNumber) {
        super(
            `Error: The email address '${user.email}' of the user '${user.username}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.user = user;
        this.name = "EmailExistsException";
    }
}

/** La categoría no existe en VideoSystem */
class UserNotExistsException extends VideoSystemException {
    constructor(user, fileName, lineNumber) {
        super(
            `Error: The user '${user.username}' doesn't exist in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.user = user;
        this.name = "UserNotExistsException";
    }
}

/** La producción existe en VideoSystem */
class ProductionExistsException extends VideoSystemException {
    constructor(production, fileName, lineNumber) {
        super(
            `Error: The production '${production.title}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.production = production;
        this.name = "ProductionExistsException";
    }
}

/** La producción no existe en VideoSystem */
class ProductionNotExistsException extends VideoSystemException {
    constructor(production, fileName, lineNumber) {
        super(
            `Error: The production '${production.title}' doesn't exist in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.production = production;
        this.name = "ProductionNotExistsException";
    }
}

/** El actor existe en VideoSystem */
class ActorExistsException extends VideoSystemException {
    constructor(actor, fileName, lineNumber) {
        super(
            `Error: The actor '${actor.name} ${actor.lastname1}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.actor = actor;
        this.name = "ActorExistsException";
    }
}

/** El actor no existe en VideoSystem */
class ActorNotExistsException extends VideoSystemException {
    constructor(actor, fileName, lineNumber) {
        super(
            `Error: The actor '${actor.name} ${actor.lastname1}' doesn't exist in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.actor = actor;
        this.name = "ActorNotExistsException";
    }
}

/** El director existe en VideoSystem */
class DirectorExistsException extends VideoSystemException {
    constructor(director, fileName, lineNumber) {
        super(
            `Error: The director '${director.name} ${director.lastname1}' already exists in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.director = director;
        this.name = "DirectorExistsException";
    }
}

/** El director no existe en VideoSystem */
class DirectorNotExistsException extends VideoSystemException {
    constructor(director, fileName, lineNumber) {
        super(
            `Error: The director '${director.name} ${director.lastname1}' doesn't exist in the VideoSystem.`,
            fileName,
            lineNumber,
        );
        this.director = director;
        this.name = "DirectorNotExistsException";
    }
}

/** Producción existe en categoría */
class ProductionExistsInCategoryException extends VideoSystemException {
    constructor(production, category, fileName, lineNumber) {
        super(
            `Error: The production ${production.title} already exists in the category ${category.name}.`,
            fileName,
            lineNumber,
        );
        this.production = production;
        this.category = category;
        this.name = "ProductionExistInCategoryException";
    }
}

/** Producción que existe en actor */
class ProductionExistsInActorException extends VideoSystemException {
    constructor(production, actor, fileName, lineNumber) {
        super(
            `Error: The production ${production.title} already exists in the category ${actor.name}.`,
            fileName,
            lineNumber,
        );
        this.production = production;
        this.actor = actor;
        this.name = "ProductionExistsInActorException";
    }
}

/** Producción existe en director */
class ProductionExistsInDirectorException extends VideoSystemException {
    constructor(production, director, fileName, lineNumber) {
        super(
            `Error: The production ${production.title} already exists in the director ${director.name}.`,
            fileName,
            lineNumber,
        );
        this.production = production;
        this.director = director;
        this.name = "ProductionExistsInDirectorException";
    }
}

export {
    VideoSystemException,
    ObjectVideoSystemException,
    NullVideoSystemException,
    CategoryExistsException,
    CategoryNotExistsException,
    UserExistsException,
    EmailExistsException,
    UserNotExistsException,
    ProductionExistsException,
    ProductionNotExistsException,
    ActorExistsException,
    ActorNotExistsException,
    DirectorExistsException,
    DirectorNotExistsException,
    ProductionExistsInCategoryException,
    ProductionExistsInActorException,
    ProductionExistsInDirectorException,
};
