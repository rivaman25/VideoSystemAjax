import { testObjects } from "./testObjects.js";

import VideoSystemModel from "./videoSystemModel.js";

function testSystem() {
    testObjects(); // Test de los objetos

    console.log("\n##### Testeo Objeto VideoSystemModel. ##### ");

    const vs = VideoSystemModel.getInstance();
    const newVs = VideoSystemModel.getInstance();

    console.log(
        "-------------------- Probando patrón Singleton -------------------------",
    );
    console.log(
        "La instancia de vs es igual que la instancia de newVs: " +
            (vs === newVs),
    );
    console.log("El nombre de la instancia por defecto: " + vs.name);
    vs.name = "MyVideoSystem";
    console.log("Nuevo nombre: " + vs.name);

    function testCategories() {
        console.log("\n##### Test Category #####");

        console.log("Buscando la categoría Default con el iterador:");
        for (const cat of vs.categories) {
            if (cat.name === "Default") {
                console.log(
                    `El Video en Streaming '${vs.name}' tiene registrada una categoría por defecto`,
                );
            }
        }

        // --- Crear categorías ---
        const c1 = vs.createCategory("Acción", "Películas de acción");
        const c2 = vs.createCategory("Drama", "Películas dramáticas");
        const c3 = vs.createCategory("Comedia", "Películas de humor");

        console.log("\n##### Test addCategory #####");

        // Añadir categorías
        console.log("Número de categorías:", vs.addCategory(c1, c2));
        console.log("Número de categorías:", vs.addCategory(c3));

        // Intentar añadir duplicado
        try {
            vs.addCategory(c1);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }

        // Intentar añadir algo que no es Category
        try {
            vs.addCategory("no es categoría");
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }

        // Crear producciones para probar la reasignación
        console.log("--- Test de createProduction ---");
        console.log("Crea las producciones: Terminator y Titanic");
        const p1 = vs.createProduction(
            "Movie",
            "Terminator",
            "26/10/1984",
            "EEUU",
        );
        const p2 = vs.createProduction(
            "Movie",
            "Titanic",
            "19/12/1997",
            "EEUU",
        );

        console.log("--- Test assignCategory --- ");
        vs.addProduction(p2);
        vs.assignCategory(c1, p1, p2);
        console.log("Las producciones que no exiten las añade as sistema:");
        for (const p of vs.productions) {
            console.log(p.toString());
        }
        const c4 = vs.createCategory("Terror", "Películas de miedo");
        vs.assignCategory(c4, p1);
        console.log("Las categorias que no exiten las añade as sistema:");
        for (const c of vs.categories) {
            console.log(c.toString());
        }
        try {
            vs.assignCategory("no es Category", p1, p2);
        } catch (error) {
            console.log(
                "Error al asignar objeto que no es Category: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }
        try {
            vs.assignCategory(c4, "no es Producton", p1);
        } catch (error) {
            console.log(
                "Error al asignar objeto que no es Production: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }

        console.log("\n##### Test removeCategory() #####");

        // Elimina la categoría Acción, sus producciones pasan a default
        console.log(
            "Número de categorías tras eliminar Acción:",
            vs.removeCategory(c1),
        );

        console.log("Las producciones de la categoría Default:");
        const defaultCat = vs.createCategory("Default");
        for (const prod of vs.getProductionsCategory(defaultCat)) {
            console.log(prod.title);
        }

        // Intenta eliminar categoría que no existe
        try {
            console.log("Intenta eliminar la categoría 'Inexistente':");
            const c5 = vs.createCategory("Inexistente");
            vs.removeCategory(c5);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        // Intenta eliminar Default
        try {
            console.log("Intenta eliminar la categoría default: (");
            vs.removeCategory(defaultCat);
        } catch (error) {
            console.log(error.name + ") " + error.message);
        }

        // Intenta eliminar algo que no es Category
        try {
            vs.removeCategory(123);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }

        console.log("--- Test deassignCategory ---");
        vs.deassignCategory(defaultCat, p1);
        console.log(
            "Producciones de la categoría default después deasignar 'Terminator'",
        );
        for (const pc of vs.getProductionsCategory(defaultCat)) {
            console.log(pc.title);
        }
        console.log("Deasigna una categoría que no existe:");
        try {
            vs.deassignCategory(c1, p1);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }
        console.log("Deasigna algo que no es Production:");
        try {
            vs.deassignCategory(defaultCat, "No es producción");
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }
    }
    testCategories();

    function testUser() {
        console.log("\n##### Test addUser() #####");
        const u1 = vs.createUser("manuel", "manuel@example.com", "1234");
        const u2 = vs.createUser("ana", "ana@example.com", "abcd");
        console.log(
            "Número de usuarios después de insertar: " + vs.addUser(u1, u2),
        );
        console.log("Usuarios añadidos correctamente:");
        for (const u of vs.users) {
            console.log(u.username);
        }

        // duplicado
        try {
            vs.addUser(u1);
        } catch (error) {
            console.log(
                "Intenta añadir el usuario 'Manuel': (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }
        try {
            vs.addUser("no es un usuario");
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }

        console.log("\n##### Test removeUser() #####");

        const u3 = vs.createUser("manuel", "manuel@example.com", "1234");
        const u4 = vs.createUser("ana", "ana@example.com", "abcd");
        console.log("Eliminando usuario 'manuel'...");
        console.log("Usuarios restantes:", vs.removeUser(u4));
        try {
            vs.removeUser(u3);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            vs.removeUser("no es un usuario");
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testUser();

    function testProduction() {
        console.log("\n##### Test addProduction() #####");

        const p1 = vs.createProduction(
            "Movie",
            "Tesis",
            "12/04/1996",
            "España",
        );
        const p2 = vs.createProduction(
            "Serie",
            "Lost",
            "22/09/2004",
            "EEUU",
            "Misterio",
            "./lost.jpg",
            6,
        );

        console.log("Producciones totales:", vs.addProduction(p1, p2));
        console.log("Test del iterador, lista de producciones:");
        for (const p of vs.productions) {
            console.log(p.toString());
        }

        // Intentar duplicado
        try {
            vs.addProduction(p1);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        // Intentar duplicado
        try {
            vs.addProduction("No es producción");
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        console.log("\n##### Test removeProduction() #####");

        // Asignar producciones a categorías para probar la eliminación
        const defaultCat = vs.createCategory("Default");
        vs.assignCategory(defaultCat, p1, p2);

        console.log(
            "Producciones totales tras eliminar 'Tesis':",
            vs.removeProduction(p1),
        );

        console.log("Las producciones de la categoría Default:");
        for (const prod of vs.getProductionsCategory(defaultCat)) {
            console.log(prod.title);
        }

        // Intentar eliminar producción inexistente
        try {
            vs.removeProduction(p1);
        } catch (error) {
            console.log(
                "Intenta eliminar 'Tesis': (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }

        // Intentar eliminar un objeto que no es Production
        try {
            vs.removeProduction({});
        } catch (error) {
            console.log(
                "Intenta eliminar 'Tesis': (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }
    }
    testProduction();

    function testActor() {
        console.log("\n##### Test Actor #####");

        // --- Crear actores ---
        const a1 = vs.createPerson("actor", "Tom", "Cruise", "03/07/1962");
        const a2 = vs.createPerson("actor", "Penelope", "Cruz", "28/04/1974");
        const a3 = vs.createPerson("actor", "Santiago", "Segura", "17/7/1965");

        console.log("\n##### Test addActor #####");

        console.log("Añadir actores");
        console.log("Número de actores:", vs.addActor(a1, a2));
        console.log("Número de actores:", vs.addActor(a3));

        console.log("Test del iterador, lista de actores:");
        for (const d of vs.actors) {
            console.log(d.toString());
        }

        console.log("Intentar añadir duplicado");
        try {
            vs.addActor(a1);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        console.log("Intentar añadir algo que no es Actor:");
        try {
            vs.addActor("no es actor");
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        console.log("\n##### Test removeActor() #####");

        console.log(
            "Número de actores tras eliminar 'Tom Cruise':",
            vs.removeActor(a1),
        );

        // Intenta eliminar actor que no existe
        try {
            console.log("Intentado eliminar actor que no está registrado:");
            const c4 = vs.createPerson(
                "actor",
                "nombre",
                "apellido",
                "01/01/1900",
            );
            vs.removeActor(c4);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        // Intenta eliminar algo que no es Actor
        try {
            vs.removeActor(123);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testActor();

    function testDirector() {
        console.log("\n##### Test Director #####");

        // --- Crear directores ---
        const d1 = vs.createPerson(
            "director",
            "Alfred",
            "Hitchcock",
            "05/09/1899",
        );
        const d2 = vs.createPerson("director", "Woody", "Allen", "01/02/1935");
        const d3 = vs.createPerson(
            "director",
            "Martin",
            "Scorsese",
            "07/03/1942",
        );

        console.log("\n##### Test addDirector #####");

        console.log("Añadir directores");
        console.log("Número de directores:", vs.addDirector(d1, d2));
        console.log("Número de direcotres:", vs.addDirector(d3));

        console.log("Test del iterador, lista de directores:");
        for (const d of vs.directors) {
            console.log(d.toString());
        }

        try {
            vs.addDirector(d1);
        } catch (error) {
            console.log(
                "Intenta añadir duplicado: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }

        try {
            vs.addDirector("no es director");
        } catch (error) {
            console.log(
                "Intenta añadir algo que no es Director: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }

        console.log("\n##### Test removeDirector() #####");

        console.log(
            "Número de directores tras eliminar 'Alfred Hitchcock':",
            vs.removeDirector(d1),
        );

        try {
            console.log(
                "Intentado eliminar el director que no existe en el sistema:",
            );
            const c4 = vs.createDirector(
                "Inexistente",
                "Inexistente",
                "01/01/2000",
            );
            vs.removeDirector(c4);
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }

        try {
            vs.removeDirector(123);
        } catch (error) {
            console.log(
                "Intenta eliminar algo que no es Director: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }
    }
    testDirector();

    function testAssignAndDeassignActor() {
        console.log("\n##### Test assignActor y deasignActor #####");

        const actor = vs.createPerson("actor", "Tom", "Hanks", "09/07/1956");
        const movie = vs.createProduction(
            "Movie",
            "Forrest Gump",
            "01/07/1994",
            "USA",
        );

        vs.addActor(actor);
        vs.addProduction(movie);

        vs.assignActor(actor, movie);
        console.log("Tom Hanks se ha asignado a Forrest Gump.");

        vs.deassignActor(actor, movie);
        console.log("El actor se ha desvinculado de la producción.");
    }
    testAssignAndDeassignActor();

    function testAssignAndDeassignDirector() {
        console.log("\n##### Test assignDirector y deasignDirector #####");

        const director = vs.createPerson(
            "director",
            "Ridley",
            "Scott",
            "30/11/1937",
        );
        const movie = vs.createProduction(
            "Movie",
            "Alien",
            "31/10/1979",
            "USA",
        );

        vs.addDirector(director);
        vs.addProduction(movie);

        vs.assignDirector(director, movie);
        console.log("Ridley Scott se ha asignado a la película Alien.");

        vs.deassignDirector(director, movie);
        console.log("El director se ha desvinculado de la película.");
    }
    testAssignAndDeassignDirector();

    function testGetCast() {
        console.log("\n##### Test getCast() #####");

        const actor1 = vs.createPerson(
            "actor",
            "Arnold",
            "Schwarzenegger",
            "30/07/1947",
        );
        const actor2 = vs.createPerson(
            "actor",
            "Linda",
            "Hamilton",
            "26/10/1956",
        );
        const movie = vs.createProduction(
            "Movie",
            "The Terminator",
            "21/08/1984",
            "USA",
        );

        vs.addActor(actor1, actor2);
        vs.addProduction(movie);
        vs.assignActor(actor1, movie);
        vs.assignActor(actor2, movie);

        const cast = vs.getCast(movie);

        console.log("Reparto de la película 'The Terminator':");
        for (const actor of cast) {
            console.log(actor.toString());
        }
    }
    testGetCast();

    function testGetProductionsDirector() {
        console.log("\n##### Test getProductionsDirector #####");

        const director = vs.createPerson(
            "director",
            "James",
            "Cameron",
            "16/08/1954",
        );
        const p1 = vs.createProduction("Movie", "Avatar", "01/06/2009", "USA");
        const p2 = vs.createProduction("Movie", "Solaris", "07/10/2002", "USA");

        vs.addDirector(director);
        vs.addProduction(p1, p2);
        vs.assignDirector(director, p1, p2);

        const result = vs.getProductionsDirector(director);

        console.log("Producciones de James Cameron:");
        for (const prod of result) {
            console.log(prod.toString());
        }
    }
    testGetProductionsDirector();

    function testGetProductionsActor() {
        console.log("\n##### Test getProductionsActor #####");

        const actor = vs.createPerson("actor", "Keanu", "Reeves", "02/10/1964");
        const p1 = vs.createProduction("Movie", "Matrix", "23/06/1999", "USA");
        const p2 = vs.createProduction(
            "Movie",
            "John Wick",
            "24/10/2014",
            "USA",
        );

        vs.addActor(actor);
        vs.addProduction(p1, p2);
        vs.assignActor(actor, p1, p2);

        const result = vs.getProductionsActor(actor);

        console.log("Producciones del actor Keanu Reeves:");
        for (const prod of result) {
            console.log(prod.toString());
        }
    }
    testGetProductionsActor();

    function testFindProductions() {
        console.log("\n##### Test findProductions #####");

        const result = vs.findProductions(
            (p) => p.publication > new Date(2000, 1, 1),
            (a, b) => a.title.localeCompare(b.title),
        );

        console.log(
            "Películas del año 2000 en adelante y ordenadas por título:",
        );
        for (const prod of result) {
            console.log(prod.toString());
        }
    }
    testFindProductions();

    function filterProductionsInCategory() {
        console.log("\n##### Test filterProductionsInCategory #####");
        const p1 = vs.createProduction(
            "Movie",
            "Tesis",
            "12/04/1996",
            "España",
        );
        const p2 = vs.createProduction("Movie", "Solaris", "07/10/2002", "USA");

        const p3 = vs.createProduction(
            "Serie",
            "Lost",
            "22/09/2004",
            "EEUU",
            "Misterio",
            "./lost.jpg",
            6,
        );
        const cat = vs.createCategory("Drama", "Películas dramáticas");
        vs.assignCategory(cat, p1, p2, p3);

        const result = vs.filterProductionsInCategory(
            cat,
            (p) => p.publication > new Date(2000, 1, 1),
            (a, b) => a.title.localeCompare(b.title),
        );
        console.log(
            "Producciones filtradas por categoría, a partir del año 2000 y ordenadas por título: ",
        );
        for (const prod of result) {
            console.log(prod.toString());
        }
    }
    filterProductionsInCategory();
}

window.onload = testSystem;
