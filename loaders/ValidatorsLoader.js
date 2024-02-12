const loader = require('./_common/fileLoader');
const Pine = require('qantra-pineapple');

/** 
 * load any file that match the pattern of function file and require them 
 * @return an array of the required functions
*/
module.exports = class ValidatorsLoader {
    constructor({ models, customValidators } = {}) {
        this.models = models;
        this.customValidators = customValidators;
    }
    load() {
        const validators = {};

        // Load validator schemas
        const schemes = loader('./managers/**/*.schema.js');

        // Iterate over loaded schemas
        Object.keys(schemes).forEach(schemaKey => {
            const pine = new Pine({ models: this.models, customValidators: this.customValidators });
            validators[schemaKey] = {};

            // Generate validator and trimmer functions for each schema
            Object.keys(schemes[schemaKey]).forEach(subKey => {
                validators[schemaKey][subKey] = async (data) => await pine.validate(data, schemes[schemaKey][subKey]);
                validators[schemaKey][`${subKey}Trimmer`] = async (data) => await pine.trim(data, schemes[schemaKey][subKey]);
            });
        });

        return validators;
    }
}