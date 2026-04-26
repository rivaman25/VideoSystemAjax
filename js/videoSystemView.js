import {
    newProductionValidation,
    deleteProductionValidation,
    updateProductionCastValidation,
} from "./validation.js";

class VideoSystemView {
    #detailsWindows = new Map(); // Registra las ventanas que se abren

    constructor() {
        this.main = document.getElementsByTagName("main")[0];
        this.menu = document.querySelector(
            "#navbarSupportedContent ul.navbar-nav",
        );
        this.actorsMenu = document.querySelector(
            "#navbarSupportedContent .navbar-nav li:nth-child(2) ul",
        );
        this.directorsMenu = document.querySelector(
            "#navbarSupportedContent .navbar-nav li:nth-child(3) ul",
        );
        this.categoriesMenu = document.querySelector(
            "#navbarSupportedContent .navbar-nav li:nth-child(4) ul",
        );
    }

    clearMain() {
        this.main.replaceChildren();
    }

    // Muestra las categorías en el cuerpo de la página
    showCategories(categories) {
        const categoriesContainer = document.createElement("div");
        categoriesContainer.id = "category-list";

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = "Categorías";
        categoriesContainer.append(title);

        const container = document.createElement("div");
        container.classList.add(
            "row",
            "row-cols-1",
            "row-cols-md-2",
            "row-cols-xl-4",
            "g-4",
        );

        for (const category of categories) {
            container.insertAdjacentHTML(
                "beforeend",
                `<div class="col">
                    <a href="#" data-category="${category.name}" class="text-decoration-none">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${category.name}</h5>
                                <p class="card-text">${category.description}</p>
                            </div>
                        </div>
                    </a>
                </div>`,
            );
        }

        categoriesContainer.append(container);
        this.main.append(categoriesContainer);
    }

    // Muestra las categorías en el menú
    showCategoriesInMenu(categories) {
        this.categoriesMenu.replaceChildren();
        for (const category of categories) {
            this.categoriesMenu.insertAdjacentHTML(
                "beforeend",
                `<li>
                    <a data-category="${category.name}" class="dropdown-item" 
                    href="#category-list">${category.name}</a>
                </li>`,
            );
        }
    }

    /** Muestra las producciones en el cuerpo de la página */
    showProductions(productions, titleText) {
        const productionsContainer = document.createElement("div");
        productionsContainer.id = "productions-list";

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = titleText;
        productionsContainer.append(title);

        const container = document.createElement("div");
        container.classList.add(
            "row",
            "row-cols-1",
            "row-cols-md-2",
            "row-cols-xl-3",
            "g-4",
        );

        for (const production of productions) {
            container.insertAdjacentHTML(
                "beforeend",
                ` <div class="col">
                    <a href="#" data-production="${production.title}" class="text-decoration-none">
                        <div class="card h-100">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="${production.image}" class="img-fluid rounded" alt="${production.image}">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title mb-3">${production.title}</h5>
                                        <p class="card-text">
                                            <span class="text-primary-emphasis">Fecha de estreno:</span> 
                                            ${production.publication.toLocaleDateString(
                                                "es-ES",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                },
                                            )}
                                        </p>
                                        <p class="card-text">
                                            <span class="text-primary-emphasis">Nacionalidad:</span> ${production.nationality}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>`,
            );
        }

        productionsContainer.append(container);
        this.main.append(productionsContainer);
    }

    /** Muestra los actores en el menú */
    showActorsInMenu(actors) {
        this.actorsMenu.replaceChildren();
        for (const actor of actors) {
            this.actorsMenu.insertAdjacentHTML(
                "beforeend",
                `<li>
                    <a data-actor="${actor.name}${actor.lastname1}" class="dropdown-item" 
                    href="#actor-profile">${actor.name} ${actor.lastname1}</a>
                </li>`,
            );
        }
    }

    /** Muestra los directores en el menú */
    showDirectorsInMenu(directors) {
        this.directorsMenu.replaceChildren();
        for (const director of directors) {
            this.directorsMenu.insertAdjacentHTML(
                "beforeend",
                `<li>
                    <a data-director="${director.name}${director.lastname1}" class="dropdown-item" 
                    href="#director-profile">${director.name} ${director.lastname1}</a>
                </li>`,
            );
        }
    }

    /** Muestra una producción con todos sus campos, así como sus directores y actores */
    showProduction(production, directors, actors) {
        const directorsList = [];
        for (const director of directors) {
            directorsList.push(`<a href="#" data-director="${director.name}${director.lastname1}" 
            class="text-decoration-none">${director.name} ${director.lastname1}</a>`);
        }
        let directorsText = directorsList.join(", ");

        const actorsList = [];
        for (const actor of actors) {
            actorsList.push(`<a href="#" data-actor="${actor.name}${actor.lastname1}" 
            class="text-decoration-none">${actor.name} ${actor.lastname1}</a>`);
        }
        let actorsText = actorsList.join(", ");

        this.main.replaceChildren();
        this.main.insertAdjacentHTML(
            "beforeend",
            `<div class="mt-3">
                <div class="card h-100">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${production.image}" class="img-fluid rounded" alt="${production.image}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h4 class="card-title mb-3">${production.title}</h4>
                                <p class="card-text" id="director-list">
                                    <span class="text-primary-emphasis">Dirección:</span> 
                                    ${directorsText}
                                </p>
                                <p class="card-text" id="actor-list">
                                    <span class="text-primary-emphasis">Reparto:</span>
                                    ${actorsText}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Fecha de estreno:</span> 
                                    ${production.publication.toLocaleDateString(
                                        "es-ES",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        },
                                    )}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Nacionalidad:</span> ${production.nationality}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Sinopsis:</span> ${production.synopsis}
                                </p>
                                <div class="text-center">
                                    <button class="btn btn-primary btn-details" data-type="Producción"
                                    data-key="production-${production.title}">Mostrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
        );
    }

    /** Muestra la ficha del actor y las películas en las que ha participado */
    showDirector(director, productions) {
        this.main.replaceChildren();

        const directorContainer = document.createElement("div");
        directorContainer.id = "director-profile";

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = "Director";
        directorContainer.append(title);

        directorContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="card" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${director.picture}" class="img-fluid rounded" 
                            alt="${director.picture}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h4 class="card-title mb-3">${director.name} ${director.lastname1}</h4>
                                <p class="card-text"><span class="text-primary-emphasis">Nacimiento:</span>
                                    ${director.born.toLocaleDateString(
                                        "es-ES",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        },
                                    )}</p>
                                <div><button class="btn btn-primary btn-details" data-type="Director" 
                                data-key="director-${director.name}${director.lastname1}">Mostrar</button></div>
                            </div>
                        </div>
                    </div>
                </div>`,
        );
        this.main.append(directorContainer);

        this.showProductions(productions, "Películas y series del director");
    }

    /** Muestra la ficha del director y las películas que ha dirigido */
    showActor(actor, productions) {
        this.main.replaceChildren();

        const actorContainer = document.createElement("div");
        actorContainer.id = "actor-profile";

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = "Actor";
        actorContainer.append(title);

        actorContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="card" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${actor.picture}" class="img-fluid rounded" 
                        alt="${actor.picture}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h4 class="card-title mb-3">${actor.name} ${actor.lastname1}</h4>
                            <p class="card-text"><span class="text-primary-emphasis">Nacimiento:</span>
                                ${actor.born.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</p>
                            <div><button class="btn btn-primary btn-details" data-type="Actor" 
                            data-key="actor-${actor.name}${actor.lastname1}">Mostrar</button></div>
                        </div>
                    </div>
                </div>
            </div>`,
        );
        this.main.append(actorContainer);

        this.showProductions(productions, "Películas y series del actor");
    }

    /** Muestra la ficha de la producción en una nueva ventana */
    showProductionDetails(production, directors, actors, key) {
        let productionWindow = this.#detailsWindows.get(key);
        const main = productionWindow.document.querySelector("main");

        const directorsList = [];
        for (const director of directors) {
            directorsList.push(`${director.name} ${director.lastname1}`);
        }
        let directorsText = directorsList.join(", ");

        const actorsList = [];
        for (const actor of actors) {
            actorsList.push(`${actor.name} ${actor.lastname1}`);
        }
        let actorsText = actorsList.join(", ");

        main.replaceChildren();
        main.insertAdjacentHTML(
            "beforeend",
            `<div class="mt-3">
                <h4>Producción</h4>
                <div class="card h-100">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${production.image}" class="img-fluid rounded" alt="${production.image}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h4 class="card-title mb-3">${production.title}</h4>
                                <p class="card-text" id="director-list">
                                    <span class="text-primary-emphasis">Dirección:</span> 
                                    ${directorsText}
                                </p>
                                <p class="card-text" id="actor-list">
                                    <span class="text-primary-emphasis">Reparto:</span>
                                    ${actorsText}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Fecha de estreno:</span> 
                                    ${production.publication.toLocaleDateString(
                                        "es-ES",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        },
                                    )}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Nacionalidad:</span> ${production.nationality}
                                </p>
                                <p class="card-text">
                                    <span class="text-primary-emphasis">Sinopsis:</span> ${production.synopsis}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
        );
    }

    /** Muestra las producciones en la ventana que se pasa por parámetro */
    showProductionsDetails(productions, titleText, detailsWindow) {
        const main = detailsWindow.document.querySelector("main");

        const productionsContainer =
            detailsWindow.document.createElement("div");
        productionsContainer.id = "productions-list";

        const title = detailsWindow.document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = titleText;
        productionsContainer.append(title);

        const container = detailsWindow.document.createElement("div");
        container.classList.add(
            "row",
            "row-cols-1",
            "row-cols-md-2",
            "row-cols-xl-3",
            "g-4",
        );

        for (const production of productions) {
            container.insertAdjacentHTML(
                "beforeend",
                ` <div class="col">
                    <div class="card h-100">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${production.image}" class="img-fluid rounded" alt="${production.image}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title mb-3">${production.title}</h5>
                                    <p class="card-text">
                                        <span class="text-primary-emphasis">Fecha de estreno:</span> 
                                        ${production.publication.toLocaleDateString(
                                            "es-ES",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            },
                                        )}
                                    </p>
                                    <p class="card-text">
                                        <span class="text-primary-emphasis">Nacionalidad:</span> ${production.nationality}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
            );
        }

        productionsContainer.append(container);
        main.append(productionsContainer);
    }

    /** Muestra la ficha del director en una nueva ventana */
    showDirectorDetails(director, productions, key) {
        let directorWindow = this.#detailsWindows.get(key);
        const main = directorWindow.document.querySelector("main");
        main.replaceChildren();

        const directorContainer = document.createElement("div");

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = "Director";
        directorContainer.append(title);

        directorContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="card" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${director.picture}" class="img-fluid rounded" 
                        alt="${director.picture}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h4 class="card-title mb-3">${director.name} ${director.lastname1}</h4>
                            <p class="card-text"><span class="text-primary-emphasis">Nacimiento:</span>
                                ${director.born.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</p>
                        </div>
                    </div>
                </div>
            </div>`,
        );
        main.append(directorContainer);

        // Muestra las producciones en las que ha participado el director
        this.showProductionsDetails(
            productions,
            "Películas y series del director",
            directorWindow,
        );
    }

    /** Muestra la ficha del actor en una nueva ventana */
    showActorDetails(actor, productions, key) {
        let actorWindow = this.#detailsWindows.get(key);
        const main = actorWindow.document.querySelector("main");
        main.replaceChildren();

        const actorContainer = document.createElement("div");

        const title = document.createElement("h3");
        title.classList.add("mt-3", "mb-2");
        title.innerHTML = "Actor";
        actorContainer.append(title);

        actorContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="card" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${actor.picture}" class="img-fluid rounded" 
                        alt="${actor.picture}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h4 class="card-title mb-3">${actor.name} ${actor.lastname1}</h4>
                            <p class="card-text"><span class="text-primary-emphasis">Nacimiento:</span>
                                ${actor.born.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}</p>
                        </div>
                    </div>
                </div>
            </div>`,
        );
        main.append(actorContainer);

        // Muestra las producciones en las que ha participado el actor
        this.showProductionsDetails(
            productions,
            "Películas y series del actor",
            actorWindow,
        );
    }

    /** Cierra todas las ventanas abiertas */
    closeDetails() {
        // Cierra las ventanas abiertas de producciones
        for (const detailsWindow of this.#detailsWindows.values()) {
            if (!detailsWindow.closed) {
                detailsWindow.close();
            }
        }

        this.#detailsWindows.clear();
    }

    /** Muestra el menú administrativo, para crear o eliminar producciones y actualizar el reparto y dirección */
    showAdminMenu() {
        const menuOption = document.createElement("li");
        menuOption.classList.add("nav-item");
        menuOption.classList.add("dropdown");
        menuOption.insertAdjacentHTML(
            "afterbegin",
            `<a class="nav-link dropdown-toggle" href="#" id="adminMenu"
                role="button" data-bs-toggle="dropdown" aria-expanded="false">Adminitración</a>`,
        );
        const suboptions = document.createElement("ul");
        suboptions.classList.add("dropdown-menu");
        suboptions.insertAdjacentHTML(
            "beforeend",
            '<li><a id="lnewProduction"class="dropdown-item" href="#new-production">Crear producción</a></li>',
        );
        suboptions.insertAdjacentHTML(
            "beforeend",
            '<li><a id="ldelProduction"class="dropdown-item" href="#del-production">Eliminar producción</a></li>',
        );
        suboptions.insertAdjacentHTML(
            "beforeend",
            '<li><a id="lupdateProductionCast"class="dropdown-item" href="#update-product-cast">Actualizar dirección y reparto</a></li>',
        );
        menuOption.append(suboptions);
        this.menu.append(menuOption);
    }

    /** Muestra el formulario para crear una nueva producción */
    showNewProductionForm(directors, actors) {
        this.main.replaceChildren();

        const container = document.createElement("div");
        container.classList.add("container");
        container.classList.add("my-3");
        container.id = "new-production";

        let directorsHtml = "";
        for (const director of directors) {
            directorsHtml += `<option value="${director.name}${director.lastname1}">
                ${director.name} ${director.lastname1}</option>`;
        }

        let actorsHtml = "";
        for (const actor of actors) {
            actorsHtml += `<option value="${actor.name}${actor.lastname1}">
                ${actor.name} ${actor.lastname1}</option>`;
        }

        container.insertAdjacentHTML(
            "beforeend",
            `<div class="card mx-0">
                <div class="card-body">
                    <h3 class="card-title">Crear producción</h3>
                    <form name="fNewProduction" role="form" class="row mt-1 g-3" novalidate>
                        <div class="col-md-6 mb-2">
                            <label class="form-label" for="npTitle">Título *</label>
                            <input type="text" class="form-control" id="npTitle"
                            name="npTitle"
                            placeholder="Título de la producción" value="" required>
                            <div class="invalid-feedback">El título es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label class="form-label" for="npNationality">Nacionalidad</label>
                            <input type="text" class="form-control" id="npNationality"
                            name="npNationality"
                            placeholder="Nacionalidad de la producción" value="">
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 col-xl-3 mb-2">
                            <label for="npType" class="form-label">Tipo de producción *</label>
                            <select id="npType" class="form-select" name="npType" required>
                                <option value ="" selected>Selecciona tipo de producción ...</option>
                                <option value="Movie">Película</option>
                                <option value="Serie">Serie</option>
                            </select>
                            <div class="invalid-feedback">El título es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 col-xl-3 mb-2">
                            <label class="form-label" for="npPublication">Fecha de estreno *</label>
                            <input
                                type="date"
                                class="form-control"
                                id="npPublication"
                                name="npPublication"
                                placeholder="Fecha de estreno"
                                value=""
                                required
                            />
                            <div class="invalid-feedback">
                                La fecha de estreno es obligatoria.
                            </div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-xl-6 mb-2">
                            <label for="npImage" class="form-label">Imagen con extenxión jpg, png o webp</label>
                            <input
                                class="form-control"
                                type="file"
                                id="npImage"
                                name="npImage"
                            />
                            <div class="invalid-feedback">
                                Debe seleccionar un archivo con extensión jpg, png o webp.
                            </div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="npSynopsis" class="form-label">Sinopsis</label>
                            <textarea class="form-control" id="npSynopsis" name="npSynopsis" rows="4" placeholder="Sinopsis de la producción"></textarea>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="npCategories" class="form-label">Categorías *</label>
                            <select class="form-select" id="npCategories" name="npCategories" multiple aria-label="Categorias" required>
                                <option value="Default">Default</option>
                                <option value="Acción">Acción</option>
                                <option value="Drama">Drama</option>
                                <option value="Comedia">Comedia</option>
                            </select>
                            <div class="invalid-feedback">La categoría es obligatoria.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="npDirectors" class="form-label">Dirección *</label>
                            <select class="form-select" id="npDirectors" name="npDirectors" multiple aria-label="Direccion" required>
                                ${directorsHtml}
                            </select>
                            <div class="invalid-feedback">El director es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="npActors" class="form-label">Actores *</label>
                            <select class="form-select" id="npActors" name="npActors" multiple aria-label="Actores" required>
                                ${actorsHtml}
                            </select>
                            <div class="invalid-feedback">El actor es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="mb-12">
                            <button class="btn btn-primary" type="submit">Enviar</button>
                            <button class="btn btn-primary" type="reset">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>`,
        );
        this.main.append(container);
    }

    /** Muestra el formulario para eliminar una producción */
    showDeleteProductionForm(productions) {
        this.main.replaceChildren();

        const container = document.createElement("div");
        container.classList.add("container");
        container.classList.add("my-3");
        container.id = "delete-production";

        let productionsHtml = "";
        for (const production of productions) {
            productionsHtml += `<option value="${production.title}">
                ${production.title}</option>`;
        }

        container.insertAdjacentHTML(
            "beforeend",
            `<div class="card mx-0">
                <div class="card-body">
                    <h3 class="card-title">Eliminar producción</h3>
                    <form name="fDeleteProduction" role="form" class="row mt-1 g-3" novalidate>
                        <div class="col-md-6 mb-2">
                            <label for="dProductions" class="form-label">Producción *</label>
                            <select class="form-select" id="dProductions" name="dProductions" aria-label="Producción" required>
                                <option value="">Selecciona una producción ...</option>
                                ${productionsHtml}
                            </select>
                            <div class="invalid-feedback">La producción es obligatoria.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="mb-12">
                            <button class="btn btn-primary" type="submit">Eliminar</button>
                            <button class="btn btn-primary" type="reset">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>`,
        );
        this.main.append(container);
    }

    /** Muestra el formulario para actualizar los directores y actores de una producción */
    showUpdateProductionCastForm(productions, directors, actors) {
        this.main.replaceChildren();

        const container = document.createElement("div");
        container.classList.add("container");
        container.classList.add("my-3");
        container.id = "update-production-cast";

        let productionsHtml = "";
        for (const prod of productions) {
            productionsHtml += `<option value="${prod.title}">
                ${prod.title}</option>`;
        }

        let directorsHtml = "";
        for (const director of directors) {
            directorsHtml += `<option value="${director.name}${director.lastname1}">
                ${director.name} ${director.lastname1}</option>`;
        }

        let actorsHtml = "";
        for (const actor of actors) {
            actorsHtml += `<option value="${actor.name}${actor.lastname1}">
                ${actor.name} ${actor.lastname1}</option>`;
        }

        container.insertAdjacentHTML(
            "beforeend",
            `<div class="card mx-0">
                <div class="card-body">
                    <h3 class="card-title">Actualizar dirección y reparto</h3>
                    <form name="fupdateProductionCast" role="form" class="row mt-1 g-3" novalidate>
                        <div class="col-12 mb-2">
                            <label for="uProductionsCast" class="form-label">Producción *</label>
                            <select class="form-select" id="uProductionsCast" name="uProductionsCast" aria-label="Producción" required>
                                <option value="">Selecciona una producción ...</option>
                                ${productionsHtml}
                            </select>
                            <div class="invalid-feedback">La producción es obligatoria.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="uDirectors" class="form-label">Dirección *</label>
                            <select class="form-select" id="uDirectors" name="uDirectors" multiple size="10" aria-label="Direccion" required>
                                ${directorsHtml}
                            </select>
                            <div class="invalid-feedback">El director es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="uActors" class="form-label">Actores *</label>
                            <select class="form-select" id="uActors" name="uActors" multiple size="10" aria-label="Actores" required>
                                ${actorsHtml}
                            </select>
                            <div class="invalid-feedback">El actor es obligatorio.</div>
                            <div class="valid-feedback">Correcto.</div>
                        </div>
                        <div class="mb-12">
                            <button class="btn btn-primary" type="submit">Actualizar</button>
                            <button class="btn btn-primary" type="reset">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>`,
        );
        this.main.append(container);
    }

    /** Muestra la producción y los directores y actores seleccionados
     *  (pertencen a la producción seleccionada en el formulario de actualización) */
    showProductionCast(directorsProduction, actorsProduction) {
        const directorsSelect = document.getElementById("uDirectors");
        const directorsOptions = directorsSelect.getElementsByTagName("option");
        for (const option of directorsOptions) {
            option.selected = directorsProduction.includes(option.value);
        }
        // Lanza el evento change para que se actualicen las validaciones
        directorsSelect.dispatchEvent(new Event("change"));

        const actorsSelect = document.getElementById("uActors");
        const actorsOptions = actorsSelect.getElementsByTagName("option");
        for (const option of actorsOptions) {
            option.selected = actorsProduction.includes(option.value);
        }
        // Lanza el evento change para que se actualicen las validaciones
        actorsSelect.dispatchEvent(new Event("change"));
    }

    /** Muestra un toast con el mensaje y color que se pasan por parámetro  */
    showToast(message, color) {
        this.main.insertAdjacentHTML(
            "beforeend",
            `<div class="position-fixed top-50 start-50 translate-middle" style="z-index: 1055;">
                <div
                    id="liveToast"
                    class="toast align-items-center text-bg-${color} border-0 mt-3 ms-1"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div class="d-flex">
                        <div class="toast-body">
                            ${message}
                        </div>
                        <button
                            type="button"
                            class="btn-close btn-close-white me-2 m-auto"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>`,
        );

        const toastTrigger = document.getElementById("liveToast");
        this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastTrigger);
        this.toastBootstrap.show();
    }

    /** Manejador para apilar entradas en el objeto history */
    #executeHandler(
        handler,
        handlerArguments,
        scrollElement,
        data,
        url,
        event,
    ) {
        handler(...handlerArguments);
        const scroll = document.querySelector(scrollElement);
        if (scroll) scroll.scrollIntoView();
        history.pushState(data, null, url);
        event.preventDefault();
    }

    // bind para los enlaces de inicio y del logo
    bindInit(handler) {
        document
            .querySelector(".navbar-brand")
            .addEventListener("click", (event) => {
                this.#executeHandler(
                    handler,
                    [],
                    "body",
                    { action: "init" },
                    "#",
                    event,
                );
            });

        document.getElementById("init").addEventListener("click", (event) => {
            this.#executeHandler(
                handler,
                [],
                "body",
                { action: "init" },
                "#",
                event,
            );
        });
    }

    bindShowActorsInMenu(handler) {
        const links = this.actorsMenu.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { actor } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [actor],
                    "body",
                    { action: "showActor", actor },
                    "#actor-profile",
                    event,
                );

                // handler(event.currentTarget.dataset.actor);
            });
        }
    }

    bindShowDirectorsInMenu(handler) {
        const links = this.directorsMenu.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { director } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [director],
                    "body",
                    { action: "showDirector", director },
                    "#director-profile",
                    event,
                );
                // handler(event.currentTarget.dataset.director);
            });
        }
    }

    bindProductsCategoryListInMenu(handler) {
        const links = this.categoriesMenu.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { category } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [category],
                    "body",
                    { action: "showProductions", category },
                    "#productions-list",
                    event,
                );
                // handler(event.currentTarget.dataset.category);
            });
        }
    }

    bindProductionsCategoryList(handler) {
        const categoryList = document.getElementById("category-list");
        const links = categoryList.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { category } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [category],
                    "body",
                    { action: "showProductions", category },
                    "#productions-list",
                    event,
                );
            });
        }
    }

    bindShowProduction(handler) {
        const productionList = document.getElementById("productions-list");
        const links = productionList.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { production } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [production],
                    "body",
                    { action: "showProduction", production },
                    "#production",
                    event,
                );
            });
        }
    }

    /** Enlaza el manejador con los enlaces de los directores en la ficha de una producción */
    bindShowDirector(handler) {
        const directorList = document.getElementById("director-list");
        const links = directorList.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { director } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [director],
                    "body",
                    { action: "showDirector", director },
                    "#director",
                    event,
                );
            });
        }
    }

    /** Enlaza el manejador con los enlaces de los actores en la ficha de una producción */
    bindShowActor(handler) {
        const actorList = document.getElementById("actor-list");
        const links = actorList.querySelectorAll("a");
        for (const link of links) {
            link.addEventListener("click", (event) => {
                const { actor } = event.currentTarget.dataset;
                this.#executeHandler(
                    handler,
                    [actor],
                    "body",
                    { action: "showActor", actor },
                    "#actor",
                    event,
                );
            });
        }
    }

    /** Enlaza el manejador para abrir una ventana nueva mostrando una ficha individual */
    bindShowDetails(handler) {
        const btnOpen = document.querySelector(".btn-details");
        btnOpen.addEventListener("click", (event) => {
            const key = event.currentTarget.dataset.key;
            const type = event.currentTarget.dataset.type;

            let detailsWindow = this.#detailsWindows.get(key);

            // Comprueba si la ventana se ha abierto anteriormente
            if (!detailsWindow || detailsWindow.closed) {
                detailsWindow = window.open(
                    "details.html",
                    key,
                    "width=800,height=600, top=250, left=250, titlebar=yes, toolbar=no, menubar=no, location=no",
                );

                // Registra la ventana para llevar control de las ventanas abiertas
                this.#detailsWindows.set(key, detailsWindow);

                detailsWindow.addEventListener("DOMContentLoaded", () => {
                    handler(type, key);
                });
            } else {
                handler(type, key);
                detailsWindow.focus();
            }
        });
    }

    /** Enlaza el manejador para cerrar todas las ventanas abiertas */
    bindCloseDetails(handler) {
        const link = document.querySelector(
            "#navbarSupportedContent .navbar-nav > li:nth-child(5) a",
        );
        link.addEventListener("click", (event) => {
            handler();
        });
    }

    bindShowNewProductionForm(handler) {
        const newProductionLink = document.getElementById("lnewProduction");
        newProductionLink.addEventListener("click", (event) => {
            this.#executeHandler(
                handler,
                [],
                "#body",
                { action: "newProduction" },
                "#",
                event,
            );
        });
    }

    bindNewProductionValidation(handler) {
        newProductionValidation(handler);
    }

    bindShowDeleteProductionForm(handler) {
        const deleteProductionLink = document.getElementById("ldelProduction");
        deleteProductionLink.addEventListener("click", (event) => {
            this.#executeHandler(
                handler,
                [],
                "#body",
                { action: "deleteProduction" },
                "#",
                event,
            );
        });
    }

    bindDeleteProductionValidation(handler) {
        deleteProductionValidation(handler);
    }

    bindShowUpdateProductionCastForm(handler) {
        const updateProductionCastLink = document.getElementById(
            "lupdateProductionCast",
        );
        updateProductionCastLink.addEventListener("click", (event) => {
            this.#executeHandler(
                handler,
                [],
                "#body",
                { action: "updateProductionCast" },
                "#",
                event,
            );
        });
    }

    /** Actualiza los directores y actores de la producción seleccionada */
    bindShowProductionCast(handler) {
        const productionSelect = document.getElementById("uProductionsCast");

        productionSelect.addEventListener("change", (event) => {
            handler(event.currentTarget.value);
        });
    }

    bindUpdateProductionCastValidation(handler) {
        updateProductionCastValidation(handler);
    }
}

export default VideoSystemView;
