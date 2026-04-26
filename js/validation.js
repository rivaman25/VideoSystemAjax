function showValidationFeedback(input, valid, message) {
    const validClass = valid ? "is-valid" : "is-invalid";
    const messageDiv = valid
        ? input.parentElement.querySelector("div.valid-feedback")
        : input.parentElement.querySelector("div.invalid-feedback");
    for (const div of input.parentElement.getElementsByTagName("div")) {
        div.classList.remove("d-block");
    }
    messageDiv.classList.remove("d-none");
    messageDiv.classList.add("d-block");
    input.classList.remove("is-valid");
    input.classList.remove("is-invalid");
    input.classList.add(validClass);
    if (message) {
        messageDiv.innerHTML = message;
    }
}

function handleTextInputValidation(event) {
    this.value = this.value.trim();
    if (!this.checkValidity()) {
        showValidationFeedback(this, false);
    } else {
        showValidationFeedback(this, true);
    }
}

/** Para select utilizo esta función y no handleTextInputValidation,
 *  la función trim() interfiere en el funcionamiento */
function handleSelectValidation(event) {
    if (!this.checkValidity()) {
        showValidationFeedback(this, false);
    } else {
        showValidationFeedback(this, true);
    }
}

function isValidFileExtension(file, allowedExtensions) {
    let fileExtension = file.name.split(".").pop().toLowerCase();
    return allowedExtensions.some((extension) => {
        return extension === fileExtension;
    });
}

function handleImageValidation(event) {
    if (
        this.value &&
        !isValidFileExtension(this.files[0], ["jpg", "png", "webp"])
    ) {
        const message =
            "Debe seleccionar un archivo con extensión jpg, png o webp.";
        showValidationFeedback(this, false, message);
    } else {
        showValidationFeedback(this, true);
    }
}

function newProductionValidation(handler) {
    const form = document.forms.fNewProduction;

    form.setAttribute("novalidate", true);

    form.addEventListener("submit", function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        if (!this.npActors.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npActors, false);
            firstInvalidElement = this.npActors;
        } else {
            showValidationFeedback(this.npActors, true);
        }

        if (!this.npDirectors.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npDirectors, false);
            firstInvalidElement = this.npDirectors;
        } else {
            showValidationFeedback(this.npDirectors, true);
        }

        if (!this.npCategories.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npCategories, false);
            firstInvalidElement = this.npCategories;
        } else {
            showValidationFeedback(this.npCategories, true);
        }

        this.npSynopsis.value = this.npSynopsis.value.trim();
        showValidationFeedback(this.npSynopsis, true);

        if (
            this.npImage.value &&
            !isValidFileExtension(this.npImage.files[0], ["jpg", "png", "webp"])
        ) {
            isValid = false;
            firstInvalidElement = this.npImage;
            const message =
                "Debe seleccionar un archivo con extensión jpg, png o webp.";
            showValidationFeedback(this.npImage, false, message);
        } else {
            showValidationFeedback(this.npImage, true);
        }

        if (!this.npPublication.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npPublication, false);
            firstInvalidElement = this.npPublication;
        } else {
            showValidationFeedback(this.npPublication, true);
        }

        if (!this.npType.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npType, false);
            firstInvalidElement = this.npType;
        } else {
            showValidationFeedback(this.npType, true);
        }

        this.npNationality.value = this.npNationality.value.trim();
        showValidationFeedback(this.npNationality, true);

        if (!this.npTitle.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.npTitle, false);
            firstInvalidElement = this.npTitle;
        } else {
            showValidationFeedback(this.npTitle, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            handler(
                this.npType.value,
                this.npTitle.value,
                this.npPublication.value,
                this.npNationality.value,
                this.npSynopsis.value,
                this.npImage.value
                    ? URL.createObjectURL(this.npImage.files[0])
                    : "",
                this.npCategories.selectedOptions,
                this.npDirectors.selectedOptions,
                this.npActors.selectedOptions,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener("reset", function (event) {
        for (const div of this.querySelectorAll(
            "div.valid-feedback, div.invalid-feedback",
        )) {
            div.classList.remove("d-block");
            div.classList.add("d-none");
        }

        for (const input of this.querySelectorAll("input")) {
            input.classList.remove("is-valid");
            input.classList.remove("is-invalid");
        }

        for (const select of this.querySelectorAll("select")) {
            select.classList.remove("is-valid");
            select.classList.remove("is-invalid");
        }

        const synopsisTxt = this.querySelector("textArea");
        synopsisTxt.classList.remove("is-valid");
        synopsisTxt.classList.remove("is-invalid");

        this.npTitle.focus();
    });

    form.npTitle.addEventListener("change", handleTextInputValidation);
    form.npNationality.addEventListener("change", handleTextInputValidation);
    form.npType.addEventListener("change", handleSelectValidation);
    form.npPublication.addEventListener("change", handleSelectValidation);
    form.npImage.addEventListener("change", handleImageValidation);
    form.npSynopsis.addEventListener("change", handleTextInputValidation);
    form.npCategories.addEventListener("change", handleSelectValidation);
    form.npDirectors.addEventListener("change", handleSelectValidation);
    form.npActors.addEventListener("change", handleSelectValidation);
}

function deleteProductionValidation(handler) {
    const form = document.forms.fDeleteProduction;

    form.setAttribute("novalidate", true);

    form.addEventListener("submit", function (event) {
        let isValid = true;
        let firstInvalidElement = null;
        const select = this.dProductions;

        if (!select.checkValidity()) {
            isValid = false;
            showValidationFeedback(select, false);
            firstInvalidElement = select;
        } else {
            showValidationFeedback(select, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            handler(select.value);
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener("reset", function (event) {
        for (const div of this.querySelectorAll(
            "div.valid-feedback, div.invalid-feedback",
        )) {
            div.classList.remove("d-block");
            div.classList.add("d-none");
        }

        for (const select of this.querySelectorAll("select")) {
            select.classList.remove("is-valid");
            select.classList.remove("is-invalid");
        }

        this.dProductions.focus();
    });

    form.dProductions.addEventListener("change", handleSelectValidation);
}

function updateProductionCastValidation(handler) {
    const form = document.forms.fupdateProductionCast;

    form.setAttribute("novalidate", true);

    form.addEventListener("submit", function (event) {
        let isValid = true;
        let firstInvalidElement = null;
        const productions = this.uProductionsCast;
        const directors = this.uDirectors;

        if (!this.uDirectors.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.uDirectors, false);
            firstInvalidElement = this.uDirectors;
        } else {
            showValidationFeedback(this.uDirectors, true);
        }

        if (!this.uActors.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.uActors, false);
            firstInvalidElement = this.uActors;
        } else {
            showValidationFeedback(this.uActors, true);
        }

        if (!this.uProductionsCast.checkValidity()) {
            isValid = false;
            showValidationFeedback(this.uProductionsCast, false);
            firstInvalidElement = this.uProductionsCast;
        } else {
            showValidationFeedback(this.uProductionsCast, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            handler(
                this.uProductionsCast.value,
                this.uDirectors.selectedOptions,
                this.uActors.selectedOptions,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener("reset", function (event) {
        for (const div of this.querySelectorAll(
            "div.valid-feedback, div.invalid-feedback",
        )) {
            div.classList.remove("d-block");
            div.classList.add("d-none");
        }

        for (const select of this.querySelectorAll("select")) {
            select.classList.remove("is-valid");
            select.classList.remove("is-invalid");
        }

        this.uProductionsCast.focus();
    });

    form.uProductionsCast.addEventListener("change", handleSelectValidation);
    form.uDirectors.addEventListener("change", handleSelectValidation);
    form.uActors.addEventListener("change", handleSelectValidation);
}

export {
    newProductionValidation,
    deleteProductionValidation,
    updateProductionCastValidation,
};
