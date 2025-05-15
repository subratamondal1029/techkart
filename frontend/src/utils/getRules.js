const getRules = (rules, label) => {
  if (rules.required) {
    rules.required = `${label || "This Field"} is required`;
  }
  if (rules.minLength !== undefined && !isNaN(rules?.minLength)) {
    rules.minLength = {
      value: rules.minLength,
      message: `${label || "This Field"} must be at least ${
        rules.minLength
      } characters long`,
    };
  }
  if (rules.maxLength !== undefined && !isNaN(rules?.maxLength)) {
    rules.maxLength = {
      value: rules.maxLength,
      message: `${label || "This Field"} must be at most ${
        rules.maxLength
      } characters long`,
    };
  }
  if (rules.pattern !== undefined && rules.pattern?.message === undefined) {
    rules.pattern = {
      value: rules.pattern.value || rules.pattern,
      message: rules.pattern.message || `${label || "This Field"} is invalid`,
    };
  }

  return rules;
};

export default getRules;
