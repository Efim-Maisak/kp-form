export function getRespectfullTitle(name) {
    const nameParts = name.split(" ");
    const patronymic = nameParts[nameParts.length - 1];
    const isPatronymicMale = patronymic.endsWith("ич");

    return isPatronymicMale ? "Уважаемый" : "Уважаемая";
}