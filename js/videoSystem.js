import VideoSystemApp from "./videoSystemApp.js";

/** Acciones para recuperar el estado de la página */
const historyActions = {
    init: () => VideoSystemApp.handleInit(),
    showProductions: (event) =>
        VideoSystemApp.handleProductionsCategoryList(event.state.category),
    showProduction: (event) =>
        VideoSystemApp.handleShowProduction(event.state.production),
    showDirector: (event) =>
        VideoSystemApp.handleShowDirector(event.state.director),
    showActor: (event) => VideoSystemApp.handleShowActor(event.state.actor),
    newProduction: (event) => VideoSystemApp.handleShowNewProductionForm(),
    deleteProduction: (event) =>
        VideoSystemApp.handleShowDeleteProductionForm(),
    updateProductionCast: (event) =>
        VideoSystemApp.handleShowUpdateProductionCastForm(),
};

/** Manejador para recuperar el estado de la página al navegar por el historial */
window.addEventListener("popstate", (event) => {
    if (event.state) {
        historyActions[event.state.action](event);
    }
});

/** Apilación del evento inicial en el historial */
history.replaceState({ action: "init" }, null);
