class VideoSystemController {
    #model;
    #view;

    constructor(videoSystemModel, videoSystemView) {
        this.#model = videoSystemModel;
        this.#view = videoSystemView;
        this.onLoad(); // La carga inicial de datos se invoca al inicio de la aplicación
        this.#view.bindInit(this.handleInit);
        this.#view.bindProductionsCategoryList(
            this.handleProductionsCategoryList,
        );
        this.#view.bindProductsCategoryListInMenu(
            this.handleProductionsCategoryList,
        );
        this.#view.bindShowProduction(this.handleShowProduction);
        this.#view.bindCloseDetails(this.handleCloseDetails);
    }

    /** Evento de aplicación que invoca la carga de objetos */
    onLoad = () => {
        this.#LoadObjects();
        this.onAddCategory();
        this.onAddActor();
        this.onAddDirector();
        this.onProductionRandomList();
        this.#view.showAdminMenu(); // Crea del menú Administración
        // bind para lanzar el formulario de nueva producción, se invoca después de crear el menú Administración
        this.#view.bindShowNewProductionForm(this.handleShowNewProductionForm);
        // bind para lanzar el formulario para eliminar una producción
        this.#view.bindShowDeleteProductionForm(
            this.handleShowDeleteProductionForm,
        );
        this.#view.bindShowUpdateProductionCastForm(
            this.handleShowUpdateProductionCastForm,
        );
    };

    /** Método privado para instanciar los objetos */
    #LoadObjects() {
        // --- Crear usuario ---
        const user = this.#model.createUser(
            "manuel",
            "manuel@example.com",
            "1234",
        );
        this.#model.addUser(user);

        // --- Crear categorías ---
        const categories = [
            this.#model.createCategory(
                "Acción",
                "Películas y series de acción",
            ),
            this.#model.createCategory(
                "Drama",
                "Películas y series dramáticas",
            ),
            this.#model.createCategory(
                "Comedia",
                "Películas y series de humor",
            ),
        ];

        this.#model.addCategory(...categories);

        // --- Crear producciones ---
        const productions = [
            this.#model.createProduction(
                "Movie",
                "Terminator",
                "26/10/1984",
                "EEUU",
                " Los Ángeles, año 2029. Las máquinas dominan el mundo. Los rebeldes que luchan contra ellas tienen como líder a John Connor, un hombre que nació en los años ochenta. Para acabar con la rebelión, las máquinas deciden enviar al pasado a un robot -Terminator- cuya misión será eliminar a Sarah Connor, la madre de John, e impedir así su nacimiento.",
                "../images/the_terminator.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Tesis",
                "12/04/1996",
                "España",
                "Ángela, estudiante de Imagen, está preparando una tesis sobre la violencia audiovisual. Como complemento a su trabajo, su director de tesis se compromete a buscar en la videoteca de la facultad material para ella, pero al día siguiente es hallado muerto. Ángela conoce a Chema, un compañero experto en cine gore y pornográfico, y a Bosco, un extraño chico, amigo íntimo de una joven asesinada en una snuff movie.",
                "../images/tesis.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Alien, el octavo pasajero",
                "31/10/1979",
                "USA",
                "De regreso a la Tierra, la nave de carga Nostromo interrumpe su viaje y despierta a sus siete tripulantes.El ordenador central, MADRE, ha detectado la misteriosa transmisión de una forma de vida desconocida, procedente de un planeta cercano aparentemente deshabitado. La nave se dirige entonces al extraño planeta para investigar el origen de la comunicación.",
                "../images/alien.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "John Wick",
                "24/10/2014",
                "USA",
                "En Nueva York, John Wick, un asesino a sueldo retirado, vuelve otra vez a la acción para vengarse de los gángsters que le quitaron todo.",
                "../images/john_wick.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Titanic",
                "19/12/1997",
                "EEUU",
                "Jack (DiCaprio), un joven artista, gana en una partida de cartas un pasaje para viajar a América en el Titanic, el transatlántico más grande y seguro jamás construido. A bordo conoce a Rose (Kate Winslet), una joven de una buena familia venida a menos que va a contraer un matrimonio de conveniencia con Cal (Billy Zane), un millonario engreído a quien sólo interesa el prestigioso apellido de su prometida. Jack y Rose se enamoran, pero el prometido y la madre de ella ponen todo tipo de trabas a su relación. Mientras, el gigantesco y lujoso transatlántico se aproxima hacia un inmenso iceberg.",
                "../images/titanic.jpg",
            ),
            this.#model.createProduction(
                "Serie",
                "Perdidos (Lost)",
                "22/09/2004",
                "EEUU",
                "Serie de TV (2004-2010). 6 temporadas. 121 episodios. Historia de un variopinto grupo de supervivientes de un accidente de aviación en una remota isla del Pacífico aparentemente desierta, una isla en la que suceden cosas muy extrañas. Luchando por la supervivencia, casi medio centenar de personas mostrarán lo mejor y lo peor de sí mismas.",
                "../images/lost.jpg",
                6,
            ),
            this.#model.createProduction(
                "Movie",
                "Forrest Gump",
                "01/07/1994",
                "USA",
                "Forrest Gump (Tom Hanks) sufre desde pequeño un cierto retraso mental. A pesar de todo, gracias a su tenacidad y a su buen corazón será protagonista de acontecimientos cruciales de su país durante varias décadas. Mientras pasan por su vida multitud de cosas en su mente siempre está presente la bella Jenny (Robin Wright), su gran amor desde la infancia, que junto a su madre será la persona más importante en su vida.",
                "../images/forrest_gump.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Mystic River",
                "03/10/2003",
                "EEUU",
                "Cuando Jimmy Markum (Sean Penn), Dave Boyle (Tim Robbins) y Sean Devine (Kevin Bacon) eran unos niños que crecían juntos en un peligroso barrio obrero de Boston, pasaban los días jugando al hockey en la calle. Pero, un día, a Dave le ocurrió algo que marcó para siempre su vida y la de sus amigos. Veinticinco años más tarde, otra tragedia los vuelve a unir: el asesinato de Katie (Emmy Rossum), la hija de 19 años de Jimmy. A Sean, que es policía, le asignan el caso; pero también tiene que estar muy pendiente de Jimmy porque, en su desesperación, está intentando tomarse la justicia por su mano.",
                "../images/mystic_river.jpg",
            ),
            this.#model.createProduction(
                "Serie",
                "The Big Bang Theory",
                "24/07/2007",
                "EEUU",
                "Serie de TV (2007-2019). 12 temporadas. 280 episodios. Leonard (Johnny Galecki) y Sheldon (Jim Parsons) son dos cerebros privilegiados que comparten piso. Aunque los dos, doctores en Física, son capaces de calcular las probabilidades de existencia de otros mundos, no saben cómo relacionarse con los demás, especialmente con las chicas. Penny (Kaley Cuoco), una vecina recién llegada, es el polo opuesto a los dos amigos, de modo que su llegada altera la tranquila vida sentimental de Leonard y el desorden obsesivo-compulsivo de Sheldon.",
                "./images/the_big_bang_theory.jpg",
                12,
            ),
            this.#model.createProduction(
                "Movie",
                "Torrente, el brazo tonto de la ley",
                "13/03/1998",
                "España",
                "Torrente es un policía español, fascista, machista, racista, alcohólico y del Atleti. Tiene un vecino llamado Rafi, al que le gustan las películas de acción y las pistolas, y que vive con su madre y su prima Amparito, una ninfómana. Juntos, Torrente y Rafi, patrullarán por la noche las calles de la ciudad.",
                "../images/torrente_el_brazo_tonto_de_la_ley.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Intocable",
                "09/03/2012",
                "Francia",
                "Philippe, un aristócrata millonario que se ha quedado tetrapléjico a causa de un accidente de parapente, contrata como cuidador a domicilio a Driss, un inmigrante de un barrio marginal recién salido de la cárcel. Aunque, a primera vista, no parece la persona más indicada, los dos acaban logrando que convivan Vivaldi y Earth Wind and Fire, la elocuencia y la hilaridad, los trajes de etiqueta y el chándal. Dos mundos enfrentados que, poco a poco, congenian hasta forjar una amistad tan disparatada, divertida y sólida como inesperada, una relación única en su especie de la que saltan chispas.",
                "../images/intouchables.jpg",
            ),
            this.#model.createProduction(
                "Movie",
                "Padre no hay más que uno",
                "01/08/2019",
                "España",
                "Javier es lo que se ha bautizado como un “marido-cuñado”. Ese que sin ocuparse en absoluto de lo que supone el cuidado de la casa y de los niños, sabe perfectamente qué es lo que hay que hacer, y que continuamente regala a su mujer frases del tipo: “es que no te organizas”, o “no te pongas nerviosa”, ya que considera que su desbordada mujer se ahoga en un vaso de agua. Javier tendrá que enfrentarse a la realidad que supone bregar con cinco hijos (de entre cuatro y doce años) cuando su mujer decide irse de viaje y dejarle solo con ellos. La caótica situación que se produce en casa les dará, al mismo tiempo, la oportunidad de pasar más tiempo juntos y conocerse mejor.",
                "../images/padre_no_hay_mas_que_uno.jpg",
            ),
        ];

        this.#model.addProduction(...productions);

        // --- Asignar producciones a la categoría de acción ---
        this.#model.assignCategory(
            categories[0],
            productions[0],
            productions[1],
            productions[2],
            productions[3],
        );

        // --- Asignar producciones a la categoría de drama ---
        this.#model.assignCategory(
            categories[1],
            productions[4],
            productions[5],
            productions[6],
            productions[7],
        );

        // --- Asignar producciones a la categoría de comedia ---
        this.#model.assignCategory(
            categories[2],
            productions[8],
            productions[9],
            productions[10],
            productions[11],
        );

        // --- Crear actores ---
        const actors = [
            this.#model.createPerson(
                "actor",
                "Arnold",
                "Schwarzenegger",
                "30/07/1947",
                "",
                "../images/arnold_schwarzenegger.jpg",
            ),
            this.#model.createPerson(
                "actor",
                "Linda",
                "Hamilton",
                "26/09/1956",
                "",
                "../images/linda_hamilton.jpg",
            ),
            this.#model.createPerson(
                "actor",
                "Eduardo",
                "Noriega",
                "01/08/1973",
                "",
                "../images/eduardo_noriega.jpg",
            ),
            this.#model.createPerson(
                "actor",
                "Ana",
                "Torrent",
                "12/07/1966",
                "",
                "../images/ana_torrent.jpg",
            ),
            this.#model.createPerson(
                "actor",
                "Sigourney",
                "Weaver",
                "08/10/1949",
                "",
                "../images/sigourney_weaver.jpg",
            ),
            this.#model.createPerson(
                "actor",
                "John",
                "Hurt",
                "22/01/1940",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Keanu",
                "Reeves",
                "02/09/1964",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Michael",
                "Nyqvist",
                "08/11/1960",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Leonardo",
                "DiCarpio",
                "11/11/1974",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Kate",
                "Winslet",
                "05/10/1975",
                "",
                "../images/actress.png",
            ),
            this.#model.createPerson(
                "actor",
                "Matthew",
                "Fox",
                "14/07/1966",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Evangeline",
                "Lilly",
                "03/08/1979",
                "",
                "../images/actress.png",
            ),
            this.#model.createPerson(
                "actor",
                "Tom",
                "Hanks",
                "09/07/1956",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Robin",
                "Wright",
                "08/04/1966",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Sean",
                "Penn",
                "17/08/1960",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Tim",
                "Robbins",
                "16/10/1958",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Johnny",
                "Galecki",
                "30/04/1975",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Jim",
                "Parsons",
                "24/03/1973",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Javier",
                "Cámara",
                "19/01/1967",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Neus",
                "Asensi",
                "04/08/1965",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "François",
                "Cluzet",
                "21/09/1955",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Omar",
                "Sy",
                "20/01/1978",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Toni",
                "Acosta",
                "10/04/1972",
                "",
                "../images/actor.png",
            ),
            this.#model.createPerson(
                "actor",
                "Leo",
                "Harlem",
                "16/11/1962",
                "",
                "../images/actor.png",
            ),
        ];

        this.#model.addActor(...actors);

        // --- Crear directores ---
        const directors = [
            this.#model.createPerson(
                "director",
                "James",
                "Cameron",
                "16/08/1954",
                "",
                "../images/james_cameron.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Alejandro",
                "Amenabar",
                "31/03/1972",
                "",
                "../images/alejandro_amenabar.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Ridley",
                "Scott",
                "30/11/1937",
                "",
                "../images/ridley_scott.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Chad",
                "Stahelski",
                "20/09/1968",
                "",
                "../images/chad_stahelski.jpg",
            ),
            this.#model.createPerson(
                "director",
                "J.J.",
                "Abrams",
                "27/07/1966",
                "",
                "../images/j_j_abrams.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Robert",
                "Zemeckis",
                "14/05/1952",
                "",
                "../images/robert_zemeckis.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Clint",
                "Eastwood",
                "31/05/1930",
                "",
                "../images/clint_eastwood.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Chuck",
                "Lorre",
                "18/10/1952",
                "",
                "../images/chuck_lorre.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Santiago",
                "Segura",
                "17/07/1965",
                "",
                "../images/santiago_segura.jpg",
            ),
            this.#model.createPerson(
                "director",
                "Oliver",
                "Nakache",
                "15/04/1973",
                "",
                "../images/olivier_nakache.jpg",
            ),
        ];

        this.#model.addDirector(...directors);

        // // --- Asignar actores y director a producciones ---
        this.#model.assignActor(actors[0], productions[0]);
        this.#model.assignActor(actors[1], productions[0]);
        this.#model.assignDirector(directors[0], productions[0]);

        this.#model.assignActor(actors[2], productions[1]);
        this.#model.assignActor(actors[3], productions[1]);
        this.#model.assignDirector(directors[1], productions[1]);

        this.#model.assignActor(actors[4], productions[2]);
        this.#model.assignActor(actors[5], productions[2]);
        this.#model.assignDirector(directors[2], productions[2]);

        this.#model.assignActor(actors[6], productions[3]);
        this.#model.assignActor(actors[7], productions[3]);
        this.#model.assignDirector(directors[3], productions[3]);

        this.#model.assignActor(actors[8], productions[4]);
        this.#model.assignActor(actors[9], productions[4]);
        this.#model.assignDirector(directors[0], productions[4]);

        this.#model.assignActor(actors[10], productions[5]);
        this.#model.assignActor(actors[11], productions[5]);
        this.#model.assignDirector(directors[4], productions[5]);

        this.#model.assignActor(actors[12], productions[6]);
        this.#model.assignActor(actors[13], productions[6]);
        this.#model.assignDirector(directors[5], productions[6]);

        this.#model.assignActor(actors[14], productions[7]);
        this.#model.assignActor(actors[15], productions[7]);
        this.#model.assignDirector(directors[6], productions[7]);

        this.#model.assignActor(actors[16], productions[8]);
        this.#model.assignActor(actors[17], productions[8]);
        this.#model.assignDirector(directors[7], productions[8]);

        this.#model.assignActor(actors[18], productions[9]);
        this.#model.assignActor(actors[19], productions[9]);
        this.#model.assignDirector(directors[8], productions[9]);

        this.#model.assignActor(actors[20], productions[10]);
        this.#model.assignActor(actors[21], productions[10]);
        this.#model.assignDirector(directors[9], productions[10]);

        this.#model.assignActor(actors[22], productions[11]);
        this.#model.assignActor(actors[23], productions[11]);
        this.#model.assignDirector(directors[8], productions[11]);
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
        this.#view.showProduction(production, directors, actors);
        // Enlace de los directores
        this.#view.bindShowDirector(this.handleShowDirector);
        this.#view.bindShowActor(this.handleShowActor);
        // Enlace para mostrar la ficha en una nueva ventana
        this.#view.bindShowDetails(this.handleShowDetails);
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
        try {
            const publicationDate = new Date(publication);
            publication = publicationDate.toLocaleDateString("es-ES");
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
        this.#view.showDeleteProductionForm(this.#model.productions);
        this.#view.bindDeleteProductionValidation(this.handleDeleteProduction);
    };

    // Elimina un producción
    handleDeleteProduction = (title) => {
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
}

export default VideoSystemController;
