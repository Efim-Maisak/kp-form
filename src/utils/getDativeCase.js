// представить имя в дательном падеже

export const getDativeCase = (name) => {
    const nameParts = name.split(" ");
    const surname = nameParts[nameParts.length - 1];

    if(surname.includes("-")) {
        let dativeCaseSurname = [];
        const surnameArr = surname.split(/[-\s]+/);
        for(let i = 0; i < surnameArr.length; i++) {
            if (["в", "н", "ч"].includes(surnameArr[i].slice(-1).toLowerCase())) {
                dativeCaseSurname.push(surnameArr[i] + "у");
            } else if(["а"].includes(surnameArr[i].slice(-1).toLowerCase())) {
                const cutted = surnameArr[i].slice(0, -1);
                dativeCaseSurname.push(cutted + "ой");
            }
        };
        return nameParts[0] + " " + dativeCaseSurname.join("-");
    }

    if (["в", "н", "ч"].includes(surname.slice(-1).toLowerCase())) {
        return name + "у";
    } else if(["а"].includes(surname.slice(-1).toLowerCase())) {
        const cutted =  name.slice(0, -1);
        return cutted + "ой";
    } else if(["ий"].includes(surname.slice(-2).toLowerCase())) {
        const cutted =  name.slice(0, -2);
        return cutted + "ому";
    } else if(["ая"].includes(surname.slice(-2).toLowerCase())) {
        const cutted =  name.slice(0, -2);
        return cutted + "ей";
    } else {
        return name;
    }
};