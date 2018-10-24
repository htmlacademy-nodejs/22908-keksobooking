const BadRequest = require(`../errors/bad-request-error`);
const validateRules = require(`./rules`);

function validate(objToValidate, scheme) {
  const errors = Object.keys(objToValidate).reduce((prev, key) => {
    let innerErrors = [];
    const value = objToValidate[key];
    const currentScheme = scheme[key];

    if (currentScheme) {
      const validationErrors = Object.keys(currentScheme).reduce((initialArray, rule) => {
        const schemeRequirement = currentScheme[rule];
        const validateRule = validateRules[rule];
        const maybeError = validateRule && validateRule(value, schemeRequirement);

        if (maybeError) {
          initialArray.push({
            errorMessage: maybeError,
            fieldName: key,
            error: `Validation Error`,
          });
        }

        return initialArray;
      }, []);

      innerErrors = validationErrors;
    }

    return prev.concat(innerErrors);
  }, []);

  if (errors.length) {
    throw new BadRequest(errors);
  }
}

module.exports = validate;