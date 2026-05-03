import { getCookie } from "./util.js";

class VideoSystemController {
    #model;
    #view;
    #auth;
    #user;

    constructor(videoSystemModel, videoSystemView, auth) {
        this.#model = videoSystemModel;
        this.#view = videoSystemView;
        this.#auth = auth;
        this.#user = null;
        this.onLoad();
    }

    /** Evento de aplicación que invoca la carga de objetos */
    async onLoad() {
        // Comprueba si están aceptadas las cookies
        if (getCookie("cookiesConsent") !== "true") {
            this.#view.showCookieConsent();
            this.#view.bindShowCookieConsent(this.handleCookieConsent);
        }

        await this.#LoadObjects();
        this.onAddCategory();
        this.onAddActor();
        this.onAddDirector();
        this.onProductionRandomList();
        this.#view.bindInit(this.handleInit);
        this.#view.bindProductionsCategoryList(
            this.handleProductionsCategoryList,
        );
        this.#view.bindProductsCategoryListInMenu(
            this.handleProductionsCategoryList,
        );
        this.#view.bindShowProduction(this.handleShowProduction);
        this.#view.bindCloseDetails(this.handleCloseDetails);

        // Comprueba si el usuario ha iniciado sesión
        const userCookie = getCookie("activeUser");
        if (userCookie) {
            const user = this.#auth.getUser(userCookie);
            if (user) {
                this.#user = user;
                this.onOpenSession();
                return;
            }
        }

        // Si no ha iniciado sesión o no existe el usuario muestra el enlace de login
        this.#view.showIdentificationLink();
        this.#view.bindIdentificationLink(this.handleLoginForm);
    }

    /** Método privado para instanciar los objetos */
    async #LoadObjects() {
        // Obtener los datos
        const data = await fetch("../data/videosystemData.json").then((res) =>
            res.json(),
        );

        // --- Crear usuarios ---
        data.users.forEach((user) => {
            const newUser = this.#model.createUser(
                user.username,
                user.email,
                user.password,
            );
            this.#model.addUser(newUser);
        });

        // --- Crear categorías ---
        const categories = new Map();
        data.categories.forEach((category) => {
            const cat = this.#model.createCategory(
                category.name,
                category.description,
            );
            categories.set(category.name, cat);
        });
        this.#model.addCategory(...categories.values());

        // --- Crear producciones ---
        const productions = new Map();
        data.productions.forEach((production) => {
            const prod = this.#model.createProduction(
                production.type,
                production.title,
                production.publication,
                production.nationality,
                production.synopsis,
                production.image,
                production.seasons,
            );
            productions.set(production.title, prod);
        });
        this.#model.addProduction(...productions.values());

        // --- Asignar producciones a categorías ---
        data.categories.forEach((category) => {
            const productionsCategory = category.productions.map((title) =>
                productions.get(title),
            );
            const cat = categories.get(category.name);
            this.#model.assignCategory(cat, ...productionsCategory);
        });

        // --- Crear actores ---
        const actors = new Map();
        const directors = new Map();
        data.people.forEach((person) => {
            const p = this.#model.createPerson(
                person.role,
                person.firstName,
                person.lastName,
                person.born,
                "",
                person.image,
            );
            const key = `${person.firstName} ${person.lastName}`;
            person.role === "actor"
                ? actors.set(key, p)
                : directors.set(key, p);
        });
        this.#model.addActor(...actors.values());
        this.#model.addDirector(...directors.values());

        data.assignments.forEach((assignment) => {
            const production = productions.get(assignment.production);
            const director = directors.get(assignment.director);
            this.#model.assignDirector(director, production);
            assignment.actors.forEach((actor) => {
                const act = actors.get(actor);
                this.#model.assignActor(act, production);
            });
        });
    }

    handleCookieConsent = () => {
        this.#view.setCookiesConsent();
    };

    handleLoginForm = () => {
        this.#view.showLoginForm();
        this.#view.bindLoginForm(this.handleLogin);
    };

    handleLogin = (username, password, remember) => {
        if (this.#auth.validateUser(username, password)) {
            this.#user = this.#auth.getUser(username);
            if (remember) {
                this.#view.setUserCookie(this.#user);
            }
            this.#view.hideLoginForm();
            this.#view.removeIdentificationLink();
            this.onInit();
            this.#view.initHistory();
            this.onOpenSession();
        } else {
            this.#view.showInvalidUserMessage();
        }
    };

    onOpenSession = () => {
        // Crea el link en el menú de producciones favoritas
        this.#view.showFavoritesLink();
        this.#view.bindFavoritesLink(this.handleFavoritesLink);
        // Crea del menú Administración
        this.#view.showAdminMenu();
        // bind para lanzar el formulario de nueva producción, se invoca después de crear el menú Administración
        this.#view.bindShowNewProductionForm(this.handleShowNewProductionForm);
        // bind para lanzar el formulario para eliminar una producción
        this.#view.bindShowDeleteProductionForm(
            this.handleShowDeleteProductionForm,
        );
        // bind para lanzar el formulario para actualizar dirección y reparto de una producción
        this.#view.bindShowUpdateProductionCastForm(
            this.handleShowUpdateProductionCastForm,
        );
        this.#view.showGreetingLink(this.#user.username);
        // bind para cerrar sesión al seleccionar desconectar
        this.#view.bindCloseSession(this.handleCloseSession);

        this.#view.bindBackupLink(this.handleBackup);
    };

    handleFavoritesLink = () => {
        // Solo se muetran los favoritos si el usuario ha iniciado sesión.
        if (!this.#user) {
            this.#view.showToast(
                "Para ver las producciones favoritas es necesario estar autenticado.",
                "danger",
            );
            return;
        }
        const favProductions = new Map(); // Producciones favoritas

        for (let i = 0, key; i < localStorage.length; i++) {
            key = localStorage.key(i);
            const result = this.#model.findProductions(
                (elem, index, productions) => elem.title === key,
            );
            if (result) {
                for (const production of result) {
                    // Añadir la producción sin repetir al mapa
                    favProductions.set(key, production);
                }
            } else {
                // La producción no existe, se elimina de la lista de favoritos
                localStorage.removeItem(key);
            }
        }

        this.#view.clearMain();
        this.#view.showProductions(
            favProductions.values(),
            "Películas y series favoritas",
        );
        this.#view.bindShowProduction(this.handleShowProduction);
    };

    handleCloseSession = () => {
        this.onCloseSession();
        this.onInit();
        this.#view.initHistory();
    };

    onCloseSession() {
        this.#user = null;
        this.#view.deleteUserCookie();
        this.#view.removeFavoritesLink();
        this.#view.removeGreetingLink();
        this.#view.showIdentificationLink();
        this.#view.bindIdentificationLink(this.handleLoginForm);
        this.#view.removeAdminMenu();
    }

    /** Reinicia el estado de la aplicación */
    onInit = () => {
        this.#view.clearMain();
        this.onAddCategory();
        this.onProductionRandomList();
        // Rehacer los enlaces a las producciones
        this.#view.bindShowProduction(this.handleShowProduction);
    };

    handleInit = () => {
        this.onInit();
    };

    /** Muestra las categorías en el menú */
    onAddCategory = () => {
        this.#view.showCategoriesInMenu(this.#model.categories);
        this.#view.showCategories(this.#model.categories);
        // Rehacer los enlaces a las categorías al añadir una nueva categoría
        this.#view.bindProductionsCategoryList(
            this.handleProductionsCategoryList,
        );
        this.#view.bindProductsCategoryListInMenu(
            this.handleProductionsCategoryList,
        );
    };

    /** Muestra los actores en el menú */
    onAddActor = () => {
        this.#view.showActorsInMenu(this.#model.actors);
        this.#view.bindShowActorsInMenu(this.handleShowActor);
    };

    /** Muestra los directores en el menú */
    onAddDirector = () => {
        this.#view.showDirectorsInMenu(this.#model.directors);
        this.#view.bindShowDirectorsInMenu(this.handleShowDirector);
    };

    /** Obtiene un número de producciones de forma aleatoria y las muestra */
    onProductionRandomList = (number = 3) => {
        const productions = new Map(); // Producciones que se obtienen

        const numProductions = this.#model.getNumberProductions();
        number = Math.min(numProductions, number);

        while (productions.size < number) {
            // Obtener el índice aleatorio de la producción
            let randomIndex = Math.floor(Math.random() * numProductions);

            if (!productions.has(randomIndex)) {
                // Buscar la producción por el índice aleatorio obtenido
                const result = this.#model.findProductions(
                    (elem, index, productions) => index === randomIndex,
                );

                for (const production of result) {
                    // Añadir la producción sin repetir al mapa
                    productions.set(randomIndex, production);
                }
            }
        }

        this.#view.showProductions(productions.values(), "Películas y series");
    };

    /** Manejador para obtener las producciones de una categoría*/
    handleProductionsCategoryList = (categoryName) => {
        const category = this.#model.createCategory(categoryName);
        const productions = this.#model.getProductionsCategory(category);
        this.#view.clearMain();
        this.#view.showProductions(productions, category.description);
        // Enlaces a las producciones
        this.#view.bindShowProduction(this.handleShowProduction);
    };

    handleShowProduction = (title) => {
        let production;
        try {
            production = this.#model.createProduction("", title);
        } catch (error) {
            this.#view.showToast(
                `No se puede mostrar la producción ${title}, ha sido eliminada.`,
                "danger",
            );
            return;
        }
        const directors = this.#model.getDirectorsProduction(production);
        const actors = this.#model.getCast(production);
        // Indica si el usuario ha iniciado sesión para mostra el botón favoritos
        const authenticated = this.#user ? true : false;
        const favorite = localStorage.getItem(title) ? true : false;
        this.#view.showProduction(
            production,
            directors,
            actors,
            authenticated,
            favorite,
        );
        // Enlaces de los directores y actores
        this.#view.bindShowDirector(this.handleShowDirector);
        this.#view.bindShowActor(this.handleShowActor);
        // Enlace para mostrar la ficha en una nueva ventana
        this.#view.bindShowDetails(this.handleShowDetails);
        // Enlace para añadir o eliminar la producción de favoritos
        if (this.#user) {
            this.#view.bindToggleFavorite(this.handleToggleFavorite);
        }
    };

    /** Añade o elimina la producción de la lista de favoritos */
    handleToggleFavorite = (production) => {
        const productionFav = localStorage.getItem(production);
        if (productionFav) {
            this.#view.deleteFavoriteProduction(production);
        } else {
            this.#view.setFavoriteProduction(production);
        }
    };

    handleShowDirector = (nameDirector) => {
        const director = this.#model.createPerson("director", nameDirector);
        const productions = this.#model.getProductionsDirector(director);
        this.#view.showDirector(director, productions);
        // Enlaces a las producciones
        this.#view.bindShowProduction(this.handleShowProduction);
        // Enlace para mostrar la ficha en una nueva ventana
        this.#view.bindShowDetails(this.handleShowDetails);
    };

    handleShowActor = (nameActor) => {
        const actor = this.#model.createPerson("actor", nameActor);
        const productions = this.#model.getProductionsActor(actor);
        this.#view.showActor(actor, productions);
        // Enlaces a las producciones
        this.#view.bindShowProduction(this.handleShowProduction);
        // Enlace para mostrar la ficha en una nueva ventana
        this.#view.bindShowDetails(this.handleShowDetails);
    };

    /** Manejador para mostrar la ficha individual en una nueva ventana */
    handleShowDetails = (type, key) => {
        switch (type) {
            case "Producción":
                // key es la concatenación de 'production-' y el título de la producción
                const title = key.toString().slice("production-".length);
                const production = this.#model.createProduction("", title);
                const directors =
                    this.#model.getDirectorsProduction(production);
                const actors = this.#model.getCast(production);
                this.#view.showProductionDetails(
                    production,
                    directors,
                    actors,
                    key,
                );
                break;
            case "Director":
                // key es la concatenación de 'director-' y el nombre + apellido del director
                const directorName = key.toString().slice("director-".length);
                const director = this.#model.createPerson(
                    "director",
                    directorName,
                );
                const directorProductions =
                    this.#model.getProductionsDirector(director);
                this.#view.showDirectorDetails(
                    director,
                    directorProductions,
                    key,
                );
                break;
            case "Actor":
                // key es la concatenación de 'actor-' y el nombre + apellido del actor
                const actorName = key.toString().slice("actor-".length);
                const actor = this.#model.createPerson("actor", actorName);
                const actorProductions = this.#model.getProductionsActor(actor);
                this.#view.showActorDetails(actor, actorProductions, key);
                break;
        }
    };

    /** Manejador para cerrar todas las ventanas de fichas abiertas */
    handleCloseDetails = () => {
        this.#view.closeDetails();
    };

    /** Muestra el formulario para crear una producción */
    handleShowNewProductionForm = () => {
        // Gestión de la seguridad, evita que se pueda crear
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para crear una producción es necesario estar autenticado.",
                "danger",
            );
            return;
        }

        this.#view.showNewProductionForm(
            this.#model.directors,
            this.#model.actors,
        );
        this.#view.bindNewProductionValidation(this.handleCreateProduction);
    };

    // Crea una nueva producción
    handleCreateProduction = (
        type,
        title,
        publication,
        nationality,
        synopsis,
        image,
        categories,
        directors,
        actors,
    ) => {
        // Gestión de la seguridad, evita que se pueda crear
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para crear una producción es necesario estar autenticado.",
                "danger",
            );
            return;
        }

        try {
            const publicationDate = new Date(publication);
            publication = publicationDate.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            const newProduction = this.#model.createProduction(
                type,
                title,
                publication,
                nationality,
                synopsis,
                image,
            );

            this.#model.addProduction(newProduction);
            const storedProduction = this.#model.createProduction(type, title);

            for (const cat of categories) {
                const category = this.#model.createCategory(cat.value);
                this.#model.assignCategory(category, storedProduction);
            }

            for (const dir of directors) {
                const director = this.#model.createPerson(
                    "director",
                    dir.value,
                );
                this.#model.assignDirector(director, storedProduction);
            }

            for (const act of actors) {
                const actor = this.#model.createPerson("actor", act.value);
                this.#model.assignActor(actor, storedProduction);
            }

            this.onInit();

            this.#view.showToast(
                "La producción se ha creado correctamente.",
                "success",
            );
        } catch (error) {
            this.#view.showToast(
                "Error al crear la producción" + error.message,
                "danger",
            );
        }
    };

    /** Muestra el formulario para eliminar una producción */
    handleShowDeleteProductionForm = () => {
        // Gestión de la seguridad, evita que se pueda eliminar
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para eliminar una producción es necesario estar autenticado.",
                "danger",
            );
            return;
        }

        this.#view.showDeleteProductionForm(this.#model.productions);
        this.#view.bindDeleteProductionValidation(this.handleDeleteProduction);
    };

    // Elimina un producción
    handleDeleteProduction = (title) => {
        // Gestión de la seguridad, evita que se pueda eliminar
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para eliminar una producción es necesario estar autenticado.",
                "danger",
            );
            return;
        }

        const production = this.#model.createProduction("", title);

        try {
            this.#model.removeProduction(production);

            this.onInit();

            this.#view.showToast(
                "La producción se ha eliminado correctamente.",
                "success",
            );
        } catch (error) {
            this.#view.showToast(
                "Error al eliminar la producción" + error.message,
                "danger",
            );
        }
    };

    /** Muestra el formulario para actualizar los directores y actores de una producción */
    handleShowUpdateProductionCastForm = () => {
        // Gestión de la seguridad, evita que se pueda actualizar
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para actualizar una producción necesario estar autenticado.",
                "danger",
            );
            return;
        }

        this.#view.showUpdateProductionCastForm(
            this.#model.productions,
            this.#model.directors,
            this.#model.actors,
        );
        // Actualiza los actores y directores cuando se selecciona una producción
        this.#view.bindShowProductionCast(this.handleShowProductionCast);
        // Valida el formulario
        this.#view.bindUpdateProductionCastValidation(
            this.handleUpdateProductionCast,
        );
    };

    /** Obtiene los directores y actores de la producción y los muestra en el formulario */
    handleShowProductionCast = (title) => {
        if (title === "") {
            return;
        }
        const production = this.#model.createProduction("", title);

        const directors = Array.from(
            this.#model.getDirectorsProduction(production),
            (d) => `${d.name}${d.lastname1}`,
        );
        const actors = Array.from(
            this.#model.getCast(production),
            (a) => `${a.name}${a.lastname1}`,
        );
        this.#view.showProductionCast(directors, actors);
    };

    /** Actualiza los actores y directores de la producción */
    handleUpdateProductionCast = (title, directors, actors) => {
        // Gestión de la seguridad, evita que se pueda actualizar
        // una producción si el usuario no está autenticado
        if (!this.#user) {
            this.#view.showToast(
                "Para actualizar una producción es necesario estar autenticado.",
                "danger",
            );
            return;
        }

        const production = this.#model.createProduction("", title);

        try {
            // Deasigna los directores actuales de la producción
            for (const director of this.#model.getDirectorsProduction(
                production,
            )) {
                this.#model.deassignDirector(director, production);
            }
            // Asigna los directores seleccionados a la producción
            for (const key of directors) {
                const director = this.#model.createPerson(
                    "director",
                    key.value,
                );
                this.#model.assignDirector(director, production);
            }

            // Deasigna los actores actuales de la producción
            for (const actor of this.#model.getCast(production)) {
                this.#model.deassignActor(actor, production);
            }
            // Asigna los actores seleccionados a la producción
            for (const key of actors) {
                const actor = this.#model.createPerson("actor", key.value);
                this.#model.assignActor(actor, production);
            }

            this.onInit();

            this.#view.showToast(
                "La producción se ha actualizado correctamente.",
                "success",
            );
        } catch (error) {
            this.#view.showToast(
                "Error al actualizar la producción" + error.message,
                "danger",
            );
        }
    };

    // Backup de los objetos de VideoSystem
    handleBackup = () => {
        const users = [];
        const categories = [];
        const productions = [];
        const people = [];
        const assignments = [];

        for (const user of this.#model.users) {
            users.push({
                username: user.username,
                email: user.email,
                password: user.password,
            });
        }

        for (const category of this.#model.categories) {
            const productionsCategory = [];
            for (const prod of this.#model.getProductionsCategory(category)) {
                productionsCategory.push(prod.title);
            }

            categories.push({
                name: category.name,
                description: category.description,
                productions: productionsCategory,
            });
        }

        for (const production of this.#model.productions) {
            productions.push({
                type: production.type,
                title: production.title,
                publication: production.publication.toLocaleDateString(
                    "es-ES",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    },
                ),
                nationality: production.nationality,
                synopsis: production.synopsis,
                image: production.image,
            });

            const cast = [];
            const directorsProduction = [];

            for (const act of this.#model.getCast(production)) {
                cast.push(`${act.name} ${act.lastName1}`);
            }

            for (const dir of this.#model.getDirectorsProduction(production)) {
                directorsProduction.push(`${dir.name} ${dir.lastName1}`);
            }

            assignments.push({
                production: production.title,
                actors: cast,
                directors: directorsProduction,
            });
        }

        for (const director of this.#model.directors) {
            people.push({
                role: "director",
                firstName: director.name,
                lastName: director.lastname1,
                born: director.born.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                image: director.picture,
            });
        }

        for (const actor of this.#model.actors) {
            people.push({
                role: "actor",
                firstName: actor.name,
                lastName: actor.lastName1,
                born: actor.born.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                image: actor.picture,
            });
        }

        const videoSystemObj = {
            users: users,
            categories: categories,
            productions: productions,
            people: people,
            assignments: assignments,
        };

        const dataJson = JSON.stringify(videoSystemObj, null, 4);
        const formData = new FormData();
        formData.append("jsonObj", dataJson);

        fetch("../writeJSONBackup.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.text()) // Obtiene la respuesta como JSON
            .then(
                // Muestra el mensaje con el nombre del archivo
                (data) =>
                    this.#view.showToast(
                        "Se ha creado el archivo de backup: " + data,
                        "success",
                    ),
            )
            .catch(
                (
                    error, // Muestra el mensaje de error
                ) =>
                    this.#view.showToast(
                        "Error al realizar backup: " + error,
                        "danger",
                    ),
            );
    };
}

export default VideoSystemController;
