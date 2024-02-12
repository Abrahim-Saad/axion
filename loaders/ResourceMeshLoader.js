const loader = require('./_common/fileLoader');

module.exports = class ResourceMeshLoader {

    constructor(injectable) {
        this.nodes = {};
        this.injectable = injectable;
    }

    load() {
        const nodes = loader('./resources/**/*.rnode.js');

        // Assuming each node is a function that returns a valid resource node
        Object.keys(nodes).forEach(nodeKey => {
            const nodeBuilder = nodes[nodeKey];

            // Validate if the nodeBuilder is a function
            if (typeof nodeBuilder === 'function') {
                // Call the nodeBuilder function with injectable as an argument
                this.nodes[nodeKey] = nodeBuilder(this.injectable);
            } else {
                console.error(`Invalid resource node found for key '${nodeKey}'. It should be a function.`);
            }
        });

        return this.nodes;
    }

};