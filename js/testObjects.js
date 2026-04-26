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

function testObjects() {
    function testPerson() {
        console.log("\n##### Testeo Objeto Person. ##### ");
        let p1 = new Person(
            "Pedro",
            "Santos",
            "06/01/1990",
            "Rodriguez",
            "./imagenes/p1.jpg",
        );
        console.log("Instancia => " + p1.toString());
        console.log("Fecha de nacimiento: " + p1.born);
        try {
            Person();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Person();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Person("Antonio", "Pérez", "12/1900");
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testPerson();

    function testCategory() {
        console.log("\n##### Testeo Objeto Category. ##### ");
        let c1 = new Category("Western");
        console.log("Categoría instanciada => " + c1.toString());
        try {
            Category();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Category();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        let c = new Category("Drama", "Emotional stories");
        console.log(c.toString());
        try {
            c.name = "";
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        c.description = "Updated description";
        console.log(c.toString());
    }
    testCategory();

    function testResource() {
        console.log("\n##### Testeo Objeto Resource. ##### ");
        let r1 = new Resource(120, "./resources/resource1");
        console.log("Recurso audiovisual instanciado => " + r1.toString());
        try {
            Resource();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Resource();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Resource(120);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Resource("full", "./resources/resource1");
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        let r = new Resource(90, "./res/movie.mp4");
        console.log(r.toString());
        try {
            r.duration = -10;
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            r.link = "";
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testResource();

    function testCoordinate() {
        console.log("\n##### Testeo Objeto Coordinate. ##### ");
        let c1 = new Coordinate(3.45, -5.75);
        console.log("Coordenada instanciada => " + c1.toString());
        try {
            Coordinate();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Coordinate();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new Coordinate(7.85);
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            c1.latitude = 100;
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            c1.longitude = 200;
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testCoordinate();

    function testProduction() {
        console.log("\n##### Testeo Objeto Production. ##### ");
        try {
            Production();
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }
        try {
            new Production();
        } catch (error) {
            console.log(
                "Instanciando Production: (" +
                    error.name +
                    ") " +
                    error.message,
            );
        }
    }
    testProduction();

    function testMovie() {
        console.log("\n##### Testeo Objeto Movie. ##### ");
        try {
            Movie();
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }
        try {
            new Movie();
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        try {
            new Movie("Terminator");
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        const m1 = new Movie("Terminator", "26/10/1984", "EEUU");
        console.log(m1.toString());
        console.log("Fecha de publicación: " + m1.publication);
        let r1 = new Resource(120, "./resources/resource1");
        m1.resource = r1;
        console.log(m1.toString());
        try {
            m1.title = "";
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        try {
            m1.publication = "26/10";
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        try {
            m1.resource = new Category(
                "Action",
                "Movies with action and adventure",
            );
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        // Añadir locations
        let loc1 = new Coordinate(35.0844, -106.6504);
        let loc2 = new Coordinate(34.0522, -118.2437);
        m1.locations = [loc1, loc2];
        console.log(m1.toString());
    }
    testMovie();

    function testSerie() {
        console.log("\n##### Testeo Objeto Serie. ##### ");
        try {
            Serie();
        } catch (error) {
            console.log("(" + error.name + ") " + error.message);
        }
        try {
            new Serie();
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        try {
            new Serie("Breaking Bad");
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
        const s1 = new Serie(
            "Breaking Bad",
            "20/01/2008",
            "EEUU",
            "Meth and chaos",
            "./img/bb.jpg",
            5,
        );
        console.log(s1.toString());
        console.log("Temporadas: " + s1.seasons);

        // Añadir resources
        let r1 = new Resource(45, "./resources/bb_s1e1");
        let r2 = new Resource(47, "./resources/bb_s1e2");
        s1.resources = [r1, r2];
        console.log(s1.toString());

        // Añadir locations
        let loc1 = new Coordinate(35.0844, -106.6504);
        let loc2 = new Coordinate(34.0522, -118.2437);
        s1.locations = [loc1, loc2];
        console.log(s1.toString());

        // Errores esperados
        try {
            s1.resources = [new Category("Fake")];
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }

        try {
            s1.locations = ["not a coordinate"];
        } catch (error) {
            console.log(error.name + " - " + error.message);
        }
    }
    testSerie();

    function testUser() {
        console.log("\n##### Testeo Objeto User. ##### ");

        let u1 = new User("rivaman", "riva@example.com", "1234");
        console.log("Usuario instanciado => " + u1.toString());
        try {
            User();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            new User();
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            u1.username = "";
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            u1.email = "";
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
        try {
            u1.password = "";
        } catch (error) {
            console.log(error.name + " -> " + error.message);
        }
    }
    testUser();
}

export {
    testObjects
}