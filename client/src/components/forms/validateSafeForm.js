import { VaultItemTypes, CardRegex, CvvRegex } from "../../constants";

const EMPTY_MSSG = "Please fill out the fields.";

// check if input is empty or contains only spaces
function validate(str) {
    return str && !(/^\s*$/.test(str));
}

export default function validateSafeForm(values, type) {
    if (type === VaultItemTypes.Login) {

        if (!validate(values.title)) return EMPTY_MSSG;
        if (!validate(values.password)) return EMPTY_MSSG;

    } else if (type === VaultItemTypes.Card) {

        if (!validate(values.title)) return EMPTY_MSSG;
        if (!validate(values.name)) return EMPTY_MSSG;
        if (!validate(values.number)) return EMPTY_MSSG;
        if (!CardRegex.test(values.number)) return "Card number is invalid.";
        if (!validate(values.month)) return EMPTY_MSSG;
        if (!validate(values.year)) return EMPTY_MSSG;
        if (!validate(values.cvv)) return EMPTY_MSSG;
        if (!CvvRegex.test(values.cvv)) return EMPTY_MSSG;

    } else if (type === VaultItemTypes.Note) {

        if (!validate(values.title)) return EMPTY_MSSG;
        if (!validate(values.note)) return EMPTY_MSSG;
    }

    return '';
}