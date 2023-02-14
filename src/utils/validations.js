export const isEmpty = str => /([^\s])/.test(str);





export const withValidation = (body, validations) => {
    (Object.keys(validations)).forEach(el => {
        const validationObject = validations[el];
        validationObject.forEach(validation => {
            if (validation.required && (!isEmpty(body[el]) || !body[el])) {
                const error = validation.message ? validation.message : `${el} is required`;
                throw new Error(error);
            }
        })
    })

    return {
        ...body
    }
}