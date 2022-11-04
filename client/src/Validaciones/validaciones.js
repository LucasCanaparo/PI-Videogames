export function useTextValidation({
    formInput, //texto a validar
    maxLength, //cant max de carct
    minLength, //cant min de carct
    regEx, //testea el texto a validar
    displayText, //el principio del mnsj de error
    required, //si es requerido o no
    negateRegEx, //negar RegEx
    regExDisplay //mnsj de error ligado a la RegEx
}){
    const validations = {
        //.trim() quita los espacios iniciales, finales y repetidos del texto
        //si required esta en true y no tengo nada me tira un str vacio
        //ese str vacio luego se valida en la linea 60 del Form para corroboar si existe algun error
        requiredField: [required && !formInput.trim(), ' '], //si el input tiene algo me lo devuelve todo junto como string -> gracias al .trim()
        maxLength: [
            //si existe la validacion de maxLength (en el form) y el input la supera me tira error
            maxLength && formInput.length > maxLength,
            `${displayText} cannot be longer than ${maxLength} characters`
        ],
        minLength: [
            //si existe la validacion de minLength (en el form) y el input no la alcanza me tira error
            minLength && formInput.length < minLength,
            `${displayText} cannot be less than ${minLength} characters`
        ],
        regularExpression: [
            //solo valida si hay texto
            //no numero ni simbolos
            formInput && //si existe un input
            regEx && //y hay una regular expression dada
                (negateRegEx ? !regEx.test(formInput) : regEx.test(formInput)),
                //y si negateRegEx esta en true me niega la regEx y no me deja escribir X cosa
                //este if ternario esat condiciondao por el valor booleano de mi negateRegEx en el formulario
            regExDisplay //y me tira el error correspondiente -> error en el Formulario
        ]
    };
    //error -> array de errores (str)
    //Object.values devuelve un array cuyos elementos son valores de propiedades enumerables que se encuentran en el objeto
    //le hace el map a un objeto -> el obj validations PRIMERO conviertiendolo en array -> con el Object.values
    const error = Object.values(validations).map((validation) => {
        if (validation[0]) { //la posicion [0] es la validacion
            //si entra a la validacion retorn el mnsj de error
            return validation[1]; //la posicion [1] es el mensaje de error
        }
        //sino retorna null
        return null
    });
    //filtra todo menos lo que tenga null -> eso lo saca
    const filterErrors = error.filter((e) => e);
    return filterErrors.length ? filterErrors[0] : null;
}