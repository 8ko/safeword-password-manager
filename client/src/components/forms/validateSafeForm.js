import { VaultItemTypes } from "../../constants";

export default function validateSafeForm(values, type) {
    let errors = {};

    if (type === VaultItemTypes.Login) {

        if (!values.title) errors.title = "* Title is required";
        if (!values.password) errors.password = "* Password is required";

    } else if (type === VaultItemTypes.Card) {

        if (!values.title) errors.title = "* Brand is required";
        if (!values.name) errors.name = "* Name is required";
        if (!values.number) errors.number = "* Card number is required";
        if (!values.month) errors.year = "* Expiry month is required";
        if (!values.year) errors.year = "* Expiry year is required";
        if (!values.cvv) errors.cvv = "* CVV/CVC is required";

    } else if (type === VaultItemTypes.Note) {

        if (!values.title) errors.title = "* Title is required";
        if (!values.note) errors.note = "* Note is required";
    }

    return errors;
}