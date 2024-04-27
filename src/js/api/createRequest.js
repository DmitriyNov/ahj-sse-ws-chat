const createRequest = async (options) => {
    const request = fetch(options.url, options.data);
    const result = await request;
    if (!result.ok) {
        console.log("Error");
        return;
    }
    const response = await result.json();
    options.callback(response);
};

export default createRequest;
