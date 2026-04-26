import {
    InvalidAccessConstructorException,
    EmptyValueException,
} from "./baseExceptions.js";

import {
    Person,
    Category,
    Resource,
    Coordinate,
    Production,
    Movie,
    Serie,
    User,
} from "./objectsVideoSystem.js";

import {
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
} from "./videoSystemExceptions.js";

/**
 *  Implementación del objeto con el patrón Singleton
 * */
const VideoSystemModel = (function () {
    let instantiated; //Objeto con la instancia única VideoSystem

    //Inicialización del Singleton
    function init() {
        //Declaración de la clase VideoSystem
        class VideoSystem {
            #name = "VideoSystem";

            // El mapa de categorías será una colección de objetos literales que contendrán
            // la categoría y un array con los títulos de las producciones que pertenecen a la categoría
            #categories = new Map();
            #users = new Map();
            #productions = new Map();
            #actors = new Map();
            #directors = new Map();

            constructor() {
                // Valida si la función se invoca con el operador new
                if (!new.target) throw new InvalidAccessConstructorException();

                // Categoría por defecto
                this.#categories.set("Default", {
                    category: new Category("Default", "Default category"),
                    productions: [],
                });

                // Getter y Setter para la propiedad name
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

            /** Devuelve un iterador que permite recorrer las categorías del sistema */
            get categories() {
                const values = this.#categories.values();

                return {
                    *[Symbol.iterator]() {
                        for (const storedCategory of values) {
                            yield storedCategory.category;
                        }
                    },
                };
            }

            /** Añade una nueva categoría */
            addCategory(...categories) {
                for (const category of categories) {
                    // Validación del tipo
                    if (!(category instanceof Category)) {
                        throw new ObjectVideoSystemException(
                            category,
                            "Category",
                        );
                    }

                    // No permite categorías duplicadas
                    if (this.#categories.has(category.name)) {
                        throw new CategoryExistsException(category);
                    }

                    this.#categories.set(category.name, {
                        category,
                        productions: [],
                    });
                }

                return this.#categories.size;
            }

            /** Elimina una categoría. Al eliminar la categoría,
             *  sus productos pasan a la de por defecto. */
            removeCategory(...categories) {
                for (const category of categories) {
                    // Validación del tipo
                    if (!(category instanceof Category)) {
                        throw new ObjectVideoSystemException(
                            category,
                            "Category",
                        );
                    }

                    // Comprueba si existe la categoría
                    if (!this.#categories.has(category.name)) {
                        throw new CategoryNotExistsException(category);
                    }

                    // No permite eliminar la categoría por defecto
                    if (category.name === "Default") {
                        throw new VideoSystemException(
                            "Cannot remove default category.",
                        );
                    }

                    // Obtiene los títulos de las producciones de la categoría a eliminar
                    const catData = this.#categories.get(category.name);
                    let defaultCat = this.#categories.get("Default");

                    // Mueve los títulos de producciones a la categoría por defecto
                    for (const title of catData.productions) {
                        // Comprueba que el título no esté en la categoría por defecto
                        const index = defaultCat.productions.indexOf(title);
                        if (index === -1) {
                            defaultCat.productions.push(title);
                        }
                    }

                    // Elimina la categoría
                    this.#categories.delete(category.name);
                }

                return this.#categories.size;
            }

            /** Devuelve un iterador que permite recorrer los usuarios del sistema */
            get users() {
                const values = this.#users.values();

                return {
                    *[Symbol.iterator]() {
                        for (const user of values) {
                            yield user;
                        }
                    },
                };
            }

            /** Obtien el usuario del email */
            #getUserByEmail(email) {
                for (const user of this.#users.values()) {
                    if (user.email === email) return user;
                }
                return null;
            }

            /** Añade un nuevo usuario */
            addUser(...users) {
                for (const user of users) {
                    // Validación de tipo
                    if (!(user instanceof User)) {
                        throw new ObjectVideoSystemException(user, "User");
                    }

                    // Comprueba duplicados
                    if (this.#users.has(user.username)) {
                        throw new UserExistsException(user);
                    }

                    // Validación de email duplicado
                    const existingEmailUser = this.#getUserByEmail(user.email);
                    if (existingEmailUser) {
                        throw new EmailExistsException(user);
                    }

                    this.#users.set(user.username, user);
                }

                return this.#users.size;
            }

            /** Elimina un usuario */
            removeUser(...users) {
                for (const user of users) {
                    // Validación del tipo
                    if (!(user instanceof User)) {
                        throw new ObjectVideoSystemException(user, "user");
                    }

                    // Comprueba si existe
                    if (this.#users.has(user.username)) {
                        this.#users.delete(user.username);
                    } else {
                        throw new UserNotExistsException(user);
                    }
                }

                return this.#users.size;
            }

            /** Devuelve un iterador que permite recorrer las producciones del sistema */
            get productions() {
                const values = this.#productions.values();

                return {
                    *[Symbol.iterator]() {
                        for (const production of values) {
                            yield production;
                        }
                    },
                };
            }

            addProduction(...productions) {
                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Comprueba duplicado
                    if (this.#productions.has(production.title)) {
                        throw new ProductionExistsException(production);
                    }

                    // Añadir al sistema
                    this.#productions.set(production.title, production);
                }

                return this.#productions.size;
            }

            /** Elimina una producción del sistema. */
            removeProduction(...productions) {
                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Comprueba si existe
                    if (!this.#productions.has(production.title)) {
                        throw new ProductionNotExistsException(production);
                    }

                    // Elimina la relación de todas las categorías
                    for (const catData of this.#categories.values()) {
                        const index = catData.productions.indexOf(
                            production.title,
                        );
                        if (index !== -1) {
                            catData.productions.splice(index, 1);
                        }
                    }

                    // Elimina la relación de todos los directores
                    for (const dirData of this.#directors.values()) {
                        const index = dirData.productions.indexOf(
                            production.title,
                        );
                        if (index !== -1) {
                            dirData.productions.splice(index, 1);
                        }
                    }

                    // Elimina la relación de todos los actores
                    for (const actData of this.#actors.values()) {
                        const index = actData.productions.indexOf(
                            production.title,
                        );
                        if (index !== -1) {
                            actData.productions.splice(index, 1);
                        }
                    }

                    // Elimina del sistema
                    this.#productions.delete(production.title);
                }

                return this.#productions.size;
            }

            /** Devuelve un iterador que permite recorrer los actores registrados en el sistema */
            get actors() {
                const values = this.#actors.values();

                return {
                    *[Symbol.iterator]() {
                        for (const actor of values) {
                            yield actor.actor;
                        }
                    },
                };
            }

            /** Añade un nuevo actor */
            addActor(...actors) {
                for (const actor of actors) {
                    // Validación de tipo
                    if (!(actor instanceof Person)) {
                        throw new ObjectVideoSystemException(actor, "Actor");
                    }

                    // El identificador es name + lastname
                    const key = actor.name + actor.lastname1;
                    if (this.#actors.has(key)) {
                        throw new ActorExistsException(actor);
                    }

                    this.#actors.set(key, {
                        actor,
                        productions: [],
                    });
                }

                return this.#actors.size;
            }

            /** Elimina un actor del sistema */
            removeActor(...actors) {
                for (const actor of actors) {
                    // Validación de tipo
                    if (!(actor instanceof Person)) {
                        throw new ObjectVideoSystemException(actor, "Actor");
                    }

                    const key = actor.name + actor.lastname1;
                    if (!this.#actors.has(key)) {
                        throw new ActorNotExistsException(actor);
                    }

                    // Elimina del sistema
                    this.#actors.delete(key);
                }

                return this.#actors.size;
            }

            /** Devuelve un iterador que permite recorrer los directores registrados en el sistema */
            get directors() {
                const values = this.#directors.values();

                return {
                    *[Symbol.iterator]() {
                        for (const director of values) {
                            yield director.director;
                        }
                    },
                };
            }

            /** Añade un nuevo director */
            addDirector(...directors) {
                for (const director of directors) {
                    // Validación de tipo
                    if (!(director instanceof Person)) {
                        throw new ObjectVideoSystemException(
                            director,
                            "Director",
                        );
                    }

                    // El identificador es name + lastname
                    const key = director.name + director.lastname1;
                    if (this.#directors.has(key)) {
                        throw new DirectorExistsException(director);
                    }

                    this.#directors.set(key, {
                        director,
                        productions: [],
                    });
                }

                return this.#directors.size;
            }

            /** Elimina un director del sistema */
            removeDirector(...directors) {
                for (const director of directors) {
                    // Validación de tipo
                    if (!(director instanceof Person)) {
                        throw new ObjectVideoSystemException(
                            director,
                            "Director",
                        );
                    }

                    const key = director.name + director.lastname1;
                    if (!this.#directors.has(key)) {
                        throw new DirectorNotExistsException(director);
                    }

                    // Elimina del sistema
                    this.#directors.delete(key);
                }

                return this.#directors.size;
            }

            assignCategory(category, ...productions) {
                // Validación de categoría
                if (!(category instanceof Category)) {
                    throw new ObjectVideoSystemException(category, "Category");
                }

                // Si la categoría no existe, se crea
                if (!this.#categories.has(category.name)) {
                    this.addCategory(category);
                }

                const storedCategory = this.#categories.get(category.name);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Si la producción no está registrada, se añade
                    if (!this.#productions.has(production.title)) {
                        this.addProduction(production);
                    }

                    const storedProduct = this.#productions.get(
                        production.title,
                    );

                    // Si ya está asignada a la categoría
                    const index = storedCategory.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        throw new ProductionExistsInCategoryException(
                            production,
                            category,
                        );
                    }

                    // Asignar producción a la categoría
                    storedCategory.productions.push(storedProduct.title);
                }

                return storedCategory.productions.size;
            }

            /** Desasigna una o más producciones de una categoría. */
            deassignCategory(category, ...productions) {
                // Validación de categoría
                if (!(category instanceof Category)) {
                    throw new ObjectVideoSystemException(category, "Category");
                }

                // Si la categoría no existe, lanza excepción
                if (!this.#categories.has(category.name)) {
                    throw new CategoryNotExistsException(category);
                }

                const storedCategory = this.#categories.get(category.name);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Elimna la producción de la categoría
                    const index = storedCategory.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        storedCategory.productions.splice(index, 1);
                    }
                }

                return storedCategory.productions.size;
            }

            /** Asigna uno más producciones a un director.
             * Si el director o el objeto Production no existen se añaden al sistema. */
            assignDirector(director, ...productions) {
                // Validación de tipo
                if (!(director instanceof Person)) {
                    throw new ObjectVideoSystemException(director, "Director");
                }

                const key = director.name + director.lastname1;

                // Si el director no existe, se añade
                if (!this.#directors.has(key)) {
                    this.addDirector(director);
                }

                const storedDirector = this.#directors.get(key);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Si la producción no está registrada, se añade
                    if (!this.#productions.has(production.title)) {
                        this.addProduction(production);
                    }

                    // Si ya está asignada
                    const index = storedDirector.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        throw new ProductionExistsInDirectorException(
                            production,
                            director,
                        );
                    }

                    // Asigna la producción
                    storedDirector.productions.push(production.title);
                }
                return storedDirector.productions.length;
            }

            /** Desasigna una o más producciones de un director. */
            deassignDirector(director, ...productions) {
                // Validación de tipo
                if (!(director instanceof Person)) {
                    throw new ObjectVideoSystemException(director, "Director");
                }

                const key = director.name + director.lastname1;

                // Si el director no existe
                if (!this.#directors.has(key)) {
                    throw new DirectorNotExistsException(director);
                }

                const storedDirector = this.#directors.get(key);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    const index = storedDirector.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        storedDirector.productions.splice(index, 1);
                    }
                }

                return storedDirector.productions.length;
            }

            /** Asigna uno más producciones a un actor.
             * Si el actor o el objeto Production no existen se añaden al sistema. */
            assignActor(actor, ...productions) {
                // Validación de tipo
                if (!(actor instanceof Person)) {
                    throw new ObjectVideoSystemException(actor, "Actor");
                }

                const key = actor.name + actor.lastname1;

                // Si el actor no existe
                if (!this.#actors.has(key)) {
                    throw new ActorNotExistsException(actor);
                }

                const storedActor = this.#actors.get(key);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    // Si ya está asignada lanza excepción
                    const index = storedActor.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        throw new ProductionExistsInActorException(
                            production,
                            director,
                        );
                    }

                    // Asigna la producción
                    storedActor.productions.push(production.title);
                }

                return storedActor.productions.length;
            }

            /** Desasigna una o más producciones de un actor. */
            deassignActor(actor, ...productions) {
                // Validación de tipo
                if (!(actor instanceof Person)) {
                    throw new ObjectVideoSystemException(actor, "Actor");
                }

                const key = actor.name + actor.lastname1;

                // Si el actor no existe
                if (!this.#actors.has(key)) {
                    throw new ActorNotExistsException(actor);
                }

                const storedActor = this.#actors.get(key);

                for (const production of productions) {
                    // Validación de tipo
                    if (!(production instanceof Production)) {
                        throw new ObjectVideoSystemException(
                            production,
                            "Production",
                        );
                    }

                    const index = storedActor.productions.indexOf(
                        production.title,
                    );
                    if (index !== -1) {
                        storedActor.productions.splice(index, 1);
                    }
                }

                return storedActor.productions.length;
            }

            /** Obtiene un iterador con la relación de los actores de una producción. */
            getCast(production) {
                // Validación de null
                if (production == null) {
                    throw new NullVideoSystemException("Production");
                }

                // Validación de tipo
                if (!(production instanceof Production)) {
                    throw new ObjectVideoSystemException(
                        production,
                        "Production",
                    );
                }

                // Comprueba si existe
                if (!this.#productions.has(production.title)) {
                    throw new ProductionNotExistsException(production);
                }

                const actorsMap = this.#actors;
                const title = production.title;

                return {
                    *[Symbol.iterator]() {
                        for (const stored of actorsMap.values()) {
                            if (stored.productions.includes(title)) {
                                yield stored.actor;
                            }
                        }
                    },
                };
            }

            /** Obtiene un iterador con las producciones de un director. */
            getProductionsDirector(director) {
                // Validación null / undefined
                if (director == null) {
                    throw new NullVideoSystemException("Director");
                }

                // Validación de tipo
                if (!(director instanceof Person)) {
                    throw new ObjectVideoSystemException(director, "Director");
                }

                const key = director.name + director.lastname1;

                // Validación de existencia
                if (!this.#directors.has(key)) {
                    throw new DirectorNotExistsException(director);
                }

                const storedDirector = this.#directors.get(key);
                const productionsMap = this.#productions;

                return {
                    *[Symbol.iterator]() {
                        for (const title of storedDirector.productions) {
                            const production = productionsMap.get(title);
                            if (production) {
                                yield production;
                            }
                        }
                    },
                };
            }

            /** Obtiene un iterador con las producciones de un actor y su papel en la producción. */
            getProductionsActor(actor) {
                // Validación null / undefined
                if (actor == null) {
                    throw new NullVideoSystemException("Actor");
                }

                // Validación de tipo
                if (!(actor instanceof Person)) {
                    throw new ObjectVideoSystemException(actor, "Actor");
                }

                const key = actor.name + actor.lastname1;

                // Validación de existencia
                if (!this.#actors.has(key)) {
                    throw new ActorNotExistsException(actor);
                }

                const storedActor = this.#actors.get(key);
                const productionsMap = this.#productions;

                return {
                    *[Symbol.iterator]() {
                        for (const title of storedActor.productions) {
                            const production = productionsMap.get(title);
                            if (production) {
                                yield production;
                            }
                        }
                    },
                };
            }

            /** Obtiene un iterador con las producciones de una categoría determinada. */
            getProductionsCategory(category) {
                // Validación null / undefined
                if (category == null) {
                    throw new NullVideoSystemException("Category");
                }

                // Validación de tipo
                if (!(category instanceof Category)) {
                    throw new ObjectVideoSystemException(category, "Category");
                }

                // Validación de existencia
                if (!this.#categories.has(category.name)) {
                    throw new CategoryNotExistsException(category);
                }

                const storedCategory = this.#categories.get(category.name);
                const productionsMap = this.#productions;

                return {
                    *[Symbol.iterator]() {
                        for (const title of storedCategory.productions) {
                            const production = productionsMap.get(title);
                            if (production) {
                                yield production;
                            }
                        }
                    },
                };
            }

            /** Devuelve un objeto Person si está registrado, o crea un nuevo.
             * Si es nuevo NO lo añade al VideoSystem. */
            createPerson(type, name, lastname1, born, lastname2, picture) {
                // type indica si es actor o director
                let person =
                    type === "actor"
                        ? this.#actors.get(name)
                        : this.#directors.get(name);

                if (!person) {
                    person = new Person(
                        name,
                        lastname1,
                        born,
                        lastname2,
                        picture,
                    );
                } else {
                    person = type === "actor" ? person.actor : person.director;
                }

                return person;
            }

            // Propiedad privada con los constructores de Production
            #productionConstructors = {
                Movie,
                Serie,
            };

            /** Devuelve un objeto Production si está registrado, o crea un nuevo.
             * Si es nuevo NO lo añade al manager */
            createProduction(
                type,
                title,
                publication,
                nationality,
                synopsis,
                image,
            ) {
                let production = this.#productions.get(title);

                if (!production) {
                    production = new this.#productionConstructors[type](
                        title,
                        publication,
                        nationality,
                        synopsis,
                        image,
                    );
                }

                return production;
            }

            /** Devuelve un objeto User si está registrado, o crea un nuevo.
             * Si es nuevo NO lo añade al VideoSystem */
            createUser(username, email, password) {
                let user = this.#users.get(username);

                if (!user) {
                    user = new User(username, email, password);
                }

                return user;
            }

            /** Devuelve un objeto Category si está registrado, o crea un nuevo.
             * Si es nuevo NO lo añade al VideoSystem */
            createCategory(name = "Default", description = "Default category") {
                let cat = this.#categories.get(name);
                if (!cat) {
                    cat = new Category(name, description);
                } else {
                    cat = cat.category;
                }
                return cat;
            }

            /** Obtiene un iterador que cumpla un criterio concreto en base a una función de callback.
             *  El iterador puede estar ordenado en base a la segunda función. */
            findProductions(callbackFunction, orderFunction) {
                // Validación de callback
                if (typeof callbackFunction !== "function") {
                    throw new VideoSystemException(
                        "callbackFunction must be a function.",
                    );
                }

                // Convierte el Map en un array de producciones
                let result = [...this.#productions.values()].filter(
                    callbackFunction,
                );

                // Aplica la función de ordenación
                if (typeof orderFunction === "function") {
                    result.sort(orderFunction);
                }

                // Iterador
                return {
                    *[Symbol.iterator]() {
                        for (const production of result) {
                            yield production;
                        }
                    },
                };
            }

            /** Obtiene un iterador con las producciones de una categoría
             *  que cumplan los criterios de la función. El iterador puede estar ordenado
             *  en base a una función de ordenación. */
            filterProductionsInCategory(
                category,
                filterFunction,
                orderFunction,
            ) {
                // Validación null / undefined
                if (category == null) {
                    throw new NullVideoSystemException("Category");
                }

                // Validación de tipo
                if (!(category instanceof Category)) {
                    throw new ObjectVideoSystemException(category, "Category");
                }

                // Validación de existencia
                if (!this.#categories.has(category.name)) {
                    throw new CategoryNotExistsException(category);
                }

                const storedCategory = this.#categories.get(category.name);
                const productionsMap = this.#productions;

                // Convierte títulos en objetos Production
                let result = storedCategory.productions
                    .map((title) => productionsMap.get(title))
                    .filter((p) => p != null);

                // Aplica filtro si existe
                if (typeof filterFunction === "function") {
                    result = result.filter(filterFunction);
                }

                // Ordena
                if (typeof orderFunction === "function") {
                    result.sort(orderFunction);
                }

                // Iterador
                return {
                    *[Symbol.iterator]() {
                        for (const production of result) {
                            yield production;
                        }
                    },
                };
            }

            /** Obtiene el número de producciones */
            getNumberProductions() {
                return this.#productions.size;
            }

            /** Obtiene los directores de una producción */
            getDirectorsProduction(production) {
                // Validación de null
                if (production == null) {
                    throw new NullVideoSystemException("Production");
                }

                // Validación de tipo
                if (!(production instanceof Production)) {
                    throw new ObjectVideoSystemException(
                        production,
                        "Production",
                    );
                }

                // Comprueba si existe
                if (!this.#productions.has(production.title)) {
                    throw new ProductionNotExistsException(production);
                }

                const directorsMap = this.#directors;
                const title = production.title;

                return {
                    *[Symbol.iterator]() {
                        for (const stored of directorsMap.values()) {
                            if (stored.productions.includes(title)) {
                                yield stored.director;
                            }
                        }
                    },
                };
            }
        }

        let vs = new VideoSystem();
        Object.freeze(vs);
        return vs;
    } //Fin inicialización del Singleton

    return {
        // Devuelve un objeto con el método getInstance
        getInstance: function () {
            if (!instantiated) {
                //Si la variable instantiated es undefined, primera ejecución, ejecuta init.
                instantiated = init(); //instantiated contiene el objeto único
            }
            return instantiated; //Si ya está asignado devuelve la asignación.
        },
    };
})();

export default VideoSystemModel;
