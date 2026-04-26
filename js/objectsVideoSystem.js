"use strict";

import {
    InvalidAccessConstructorException,
    EmptyValueException,
    InvalidValueException,
    AbstractClassException,
} from "./baseExceptions.js";

/** Objeto para registrar los datos de una persona */
class Person {
    // Campos privados
    #name;
    #lastname1;
    #born;

    constructor(name, lastname1, born, lastname2 = "", picture = "") {
        // Valida si la función se invoca con el operador new
        if (!new.target) throw new InvalidAccessConstructorException();

        // Validación de parámetros obligatorios
        if (!name) throw new EmptyValueException("name");
        if (!lastname1) throw new EmptyValueException("lastname1");
        if (!born) throw new EmptyValueException("born");

        // Validación de fecha de nacimiento, debe estar en formato dd/MM/yyyy
        const [day, month, year] = born.split("/");
        const bornDate = new Date(year, month - 1, day);
        if (isNaN(bornDate.getTime())) {
            throw new InvalidValueException("born", born);
        }
        if (bornDate > new Date()) {
            throw new InvalidValueException("born", born);
        }

        // Definición de atributos privados del objeto
        this.#name = name;
        this.#lastname1 = lastname1;
        this.#born = bornDate;

        // Propiedades públicas, no requieren validación
        this.lastname2 = lastname2;
        this.picture = picture;

        // Getter y setter de los atributos privados
        Object.defineProperty(this, "name", {
            enumerable: true,
            get() {
                return this.#name;
            },
            set(value) {
                if (!value) throw new EmptyValueException("name");
                this.#name = value;
            },
        });

        Object.defineProperty(this, "lastname1", {
            enumerable: true,
            get() {
                return this.#lastname1;
            },
            set(value) {
                if (!value) throw new EmptyValueException("lastname1");
                this.#lastname1 = value;
            },
        });

        Object.defineProperty(this, "born", {
            enumerable: true,
            get() {
                return this.#born;
            },
            set(value) {
                if (!value) throw new EmptyValueException("born");

                // La fecha debe estar en formato dd/MM/yyyy
                const [day, month, year] = value.split("/");
                const bornDate = new Date(year, month - 1, day);
                if (isNaN(bornDate.getTime())) {
                    throw new InvalidValueException("born", value);
                }
                if (bornDate > new Date()) {
                    throw new InvalidValueException("born", value);
                }

                this.#born = bornDate;
            },
        });
    }

    // Método público
    toString() {
        return `Nombre: ${this.#name}; Primer apellido: ${this.#lastname1}; Segundo apellido: ${this.lastname2}; Fecha de nacimiento: ${this.#born.toLocaleDateString()}; Ruta imagen: ${this.picture};`;
    }
}

/** Representa una categoría */
class Category {
    #name;

    constructor(name, description = "") {
        if (!new.target) throw new InvalidAccessConstructorException();
        if (!name) throw new EmptyValueException("name");

        this.#name = name;
        this.description = description;

        Object.defineProperty(this, "name", {
            enumerable: true,
            get() {
                return this.#name;
            },
            set(value) {
                if (!value) throw new EmptyValueException("name");
                this.#name = value;
            },
        });
    }

    toString() {
        return `Nombre: ${this.#name}; Descripción: ${this.description};`;
    }
}

/** Representa un recurso audiovisual */
class Resource {
    #duration;
    #link;

    constructor(duration, link) {
        if (!new.target) throw new InvalidAccessConstructorException();
        if (!duration) throw new EmptyValueException("duration");
        if (!link) throw new EmptyValueException("link");

        // Validación de duración
        const durationNumber = Number.parseInt(duration);
        if (Number.isNaN(durationNumber) || durationNumber < 0)
            throw new InvalidValueException("duration", duration);

        this.#duration = durationNumber;
        this.#link = link;

        Object.defineProperty(this, "duration", {
            enumerable: true,
            get() {
                return this.#duration;
            },
            set(value) {
                if (!value) throw new EmptyValueException("duration");

                // Validación de duración
                const durationNumber = Number.parseInt(value);
                if (Number.isNaN(durationNumber) || durationNumber < 0)
                    throw new InvalidValueException("duration", value);

                this.#duration = durationNumber;
            },
        });

        Object.defineProperty(this, "link", {
            enumerable: true,
            get() {
                return this.#link;
            },
            set(value) {
                if (!value) throw new EmptyValueException("link");
                this.#link = value;
            },
        });
    }

    toString() {
        return `Duración: ${this.#duration} min; Ruta: ${this.#link};`;
    }
}

class Coordinate {
    #latitude;
    #longitude;

    constructor(latitude, longitude) {
        if (!new.target) throw new InvalidAccessConstructorException();
        if (latitude === undefined || latitude === null)
            throw new EmptyValueException("latitude");
        if (longitude === undefined || longitude === null)
            throw new EmptyValueException("longitude");

        latitude = Number.parseFloat(latitude);
        if (isNaN(latitude))
            throw new InvalidValueException("latitude", latitude);

        longitude = Number.parseFloat(longitude);
        if (isNaN(longitude))
            throw new InvalidValueException("longitude", longitude);

        // Validar rango de latitud [-90, 90]
        if (latitude < -90 || latitude > 90) {
            throw new InvalidValueException("latitude", latitude);
        }

        // Validar rango de longitud [-180, 180]
        if (longitude < -180 || longitude > 180) {
            throw new InvalidValueException("longitude", longitude);
        }

        this.#latitude = latitude;
        this.#longitude = longitude;

        Object.defineProperty(this, "latitude", {
            enumerable: true,
            get() {
                return this.#latitude;
            },
            set(value) {
                if (value === undefined || value === null)
                    throw new EmptyValueException("latitude");

                const lat = Number.parseFloat(value);
                if (isNaN(lat))
                    throw new InvalidValueException("latitude", value);

                // Validar rango de latitud [-90, 90]
                if (value < -90 || value > 90) {
                    throw new InvalidValueException("latitude", value);
                }

                this.#latitude = value;
            },
        });

        Object.defineProperty(this, "longitude", {
            enumerable: true,
            get() {
                return this.#longitude;
            },
            set(value) {
                if (value === undefined || value === null)
                    throw new EmptyValueException("longitude");

                const long = Number.parseFloat(value);
                if (isNaN(long))
                    throw new InvalidValueException("longitude", value);

                // Validar rango de longitud [-180, 180]
                if (value < -180 || value > 180) {
                    throw new InvalidValueException("longitude", value);
                }

                this.#longitude = value;
            },
        });
    }

    toString() {
        return `Latitud: ${this.#latitude}; Longitud: ${this.#longitude}`;
    }
}

class Production {
    #title;
    #publication;

    constructor(
        title,
        publication,
        nationality = "",
        synopsis = "",
        image = "",
    ) {
        // Valida si la función se invoca con el operador new
        if (!new.target) throw new InvalidAccessConstructorException();
        // Validación de clase abstracta
        if (new.target === Production)
            throw new AbstractClassException("Production");

        if (!title) throw new EmptyValueException("title");
        if (!publication) throw new EmptyValueException("publication");

        // Validación de la fecha
        const [day, month, year] = publication.split("/");
        const publicationDate = new Date(year, month - 1, day);
        if (isNaN(publicationDate.getTime()))
            throw new InvalidValueException("publication", publication);

        this.#title = title;
        this.#publication = publicationDate;

        this.nationality = nationality;
        this.synopsis = synopsis;
        this.image = image;

        Object.defineProperty(this, "title", {
            enumerable: true,
            get() {
                return this.#title;
            },
            set(value) {
                if (!value) throw new EmptyValueException("title");
                this.#title = value;
            },
        });

        Object.defineProperty(this, "publication", {
            enumerable: true,
            get() {
                return this.#publication;
            },
            set(value) {
                if (!value) throw new EmptyValueException("publication");

                // Validación de la fecha
                const [day, month, year] = value.split("/");
                const publicationDate = new Date(year, month - 1, day);
                if (isNaN(publicationDate.getTime()))
                    throw new InvalidValueException("publication", value);

                this.#publication = publicationDate;
            },
        });
    }

    toString() {
        return `Título: ${this.#title}; Nacionalidad: ${this.nationality}; Fecha: ${this.#publication.toLocaleDateString()}; Resumen: ${this.synopsis ?? ""}; Imagen: ${this.image ?? ""};`;
    }
}

class Movie extends Production {
    #resource;
    #locations;

    constructor(
        title,
        publication,
        nationality,
        synopsis,
        image,
        resource,
        locations,
    ) {
        // Valida si la función se invoca con el operador new
        if (!new.target) throw new InvalidAccessConstructorException();

        super(title, publication, nationality, synopsis, image);

        // Validación de objeto de tipo resource
        if (resource && !(resource instanceof Resource))
            throw new InvalidValueException("resource", resource.toString());

        // Validación de locations
        if (locations !== undefined && locations !== null) {
            if (!Array.isArray(locations)) {
                throw new InvalidValueException("locations", locations);
            }

            for (const loc of locations) {
                if (!(loc instanceof Coordinate)) {
                    throw new InvalidValueException("locations element", loc);
                }
            }
        }

        this.#resource = resource;
        this.#locations = locations;
    }

    get resource() {
        return this.#resource;
    }
    set resource(value) {
        if (!(value instanceof Resource))
            throw new InvalidValueException("resource", value);
        this.#resource = value;
    }

    get locations() {
        return this.#locations;
    }
    set locations(value) {
        if (!Array.isArray(value))
            throw new InvalidValueException("locations", value);
        value.forEach((loc) => {
            if (!(loc instanceof Coordinate))
                throw new InvalidValueException("locations element", loc);
        });
        this.#locations = value;
    }

    toString() {
        const res = this.resource
            ? "Recurso: " + this.resource.toString()
            : "Recurso: ;";

        const locat =
            this.locations && this.locations.length > 0
                ? this.locations.reduce(
                      (str, loc) => str + `\n - ${loc.toString()}`,
                      "\n Localizaciones:",
                  )
                : `\n Localizaciones: ninguna`;
        return super.toString() + " " + res + locat;
    }
}

class Serie extends Production {
    #resources;
    #locations;

    constructor(
        title,
        publication,
        nationality,
        synopsis,
        image,
        seasons = 0,
        resources = [],
        locations = [],
    ) {
        // Valida si la función se invoca con el operador new
        if (!new.target) throw new InvalidAccessConstructorException();

        super(title, publication, nationality, synopsis, image);

        // Validación de season
        seasons = Number.parseInt(seasons);
        if (isNaN(seasons) || seasons < 0)
            throw new InvalidValueException("seasons", seasons);

        // Validación de resources
        if (resources !== null) {
            if (!Array.isArray(resources)) {
                throw new InvalidValueException("resources", resources);
            }
            for (const res of resources) {
                if (!(res instanceof Resource)) {
                    throw new InvalidValueException("resources element", res);
                }
            }
        }

        // Validación de locations
        if (locations !== null) {
            if (!Array.isArray(locations)) {
                throw new InvalidValueException("locations", locations);
            }

            for (const loc of locations) {
                if (!(loc instanceof Coordinate)) {
                    throw new InvalidValueException("locations element", loc);
                }
            }
        }

        this.seasons = seasons;
        this.#resources = resources;
        this.#locations = locations;
    }

    get resources() {
        return this.#resources;
    }
    set resources(value) {
        if (!Array.isArray(value))
            throw new InvalidValueException("resources", value);
        value.forEach((res) => {
            if (!(res instanceof Resource))
                throw new InvalidValueException("resources element", res);
        });
        this.#resources = value;
    }

    get locations() {
        return this.#locations;
    }
    set locations(value) {
        if (!Array.isArray(value))
            throw new InvalidValueException("locations", value);
        value.forEach((loc) => {
            if (!(loc instanceof Coordinate))
                throw new InvalidValueException("locations element", loc);
        });
        this.#locations = value;
    }

    toString() {
        const res =
            this.resources && this.resources.length > 0
                ? this.resources.reduce(
                      (str, elem) => str + `\n - ${elem.toString()}`,
                      "\n Recursos:",
                  )
                : `\n Recursos: ninguno`;
        const locs =
            this.locations && this.locations.length > 0
                ? this.locations.reduce(
                      (str, loc) => str + `\n - ${loc.toString()}`,
                      "\n Localizaciones:",
                  )
                : `\n Localizaciones: ninguna`;

        return `${super.toString()} Temporadas: ${this.seasons} ${res} ${locs}`;
    }
}

class User {
    #username;
    #email;
    #password;

    constructor(username, email, password) {
        // Valida si la función se invoca con el operador new
        if (!new.target) throw new InvalidAccessConstructorException();

        if (!username) throw new EmptyValueException("username");
        if (!email) throw new EmptyValueException("email");
        if (!password) throw new EmptyValueException("password");

        this.#username = username;
        this.#email = email;
        this.#password = password;
    }

    get username() {
        return this.#username;
    }
    set username(value) {
        if (!value) throw new EmptyValueException("username");
        this.#username = value;
    }

    get email() {
        return this.#email;
    }
    set email(value) {
        if (!value) throw new EmptyValueException("email");
        this.#email = value;
    }

    get password() {
        return this.#password;
    }
    set password(value) {
        if (!value) throw new EmptyValueException("password");
        this.#password = value;
    }

    toString() {
        return `Usuario: ${this.#username}; Email: ${this.#email}`;
    }
}

export {
    Person,
    Category,
    Resource,
    Coordinate,
    Production,
    Movie,
    Serie,
    User,
};
