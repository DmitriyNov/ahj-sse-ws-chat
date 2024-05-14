const createRequest = async (options) => {
  const request = fetch(options.url, options.data);
  const result = await request;
  if (!result.ok) {
    const response = await result.json();
    alert(response.message);
    return;
  }
  const response = await result.json();
  options.callback(response);
};

export default createRequest;
