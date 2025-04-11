async function createOrder(amount) {
  // TODO: update for mern server and add new method to check the status
  try {
    const response = await fetch(
      "https://66bd992ea6145b711479.appwrite.global",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      }
    );

    const data = await response.json();
    if (data.order) {
      return data.order;
    } else return null;
  } catch (error) {
    return null;
  }
}

export { createOrder };
