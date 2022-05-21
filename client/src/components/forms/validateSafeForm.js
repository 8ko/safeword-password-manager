import { VaultItemTypes } from "../../constants";

// check if input is empty or contains only spaces
function validate(str) {
    return !(!str || /^\s*$/.test(str));
}

export default function validateSafeForm(values, type) {
    let errors = {};

    if (type === VaultItemTypes.Login) {

        if (!validate(values.title)) errors.title = "* Title is required";
        if (!validate(values.password)) errors.password = "* Password is required";

    } else if (type === VaultItemTypes.Card) {

        if (!validate(values.title)) errors.title = "* Brand is required";
        if (!validate(values.name)) errors.name = "* Name is required";
        if (!validate(values.number)) errors.number = "* Card number is required";
        if (!validate(values.month)) errors.year = "* Expiry month is required";
        if (!validate(values.year)) errors.year = "* Expiry year is required";
        if (!validate(values.cvv)) errors.cvv = "* CVV/CVC is required";

    } else if (type === VaultItemTypes.Note) {

        if (!validate(values.title)) errors.title = "* Title is required";
        if (!validate(values.note)) errors.note = "* Note is required";
    }

    return errors;
}