module.exports = async function execute(params) {
    // Create Id from current timestamp.
    const id = Date.now();
    params.variables["id"] = id;
}