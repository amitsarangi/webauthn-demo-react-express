const headers = {
  "Content-Type": "application/json"
};

const handleErrors = async response => {
  let json = {};
  try {
    if (!response.ok) {
      throw new Error();
    }
    json = await response.json();
    if (json.error) {
      throw new Error();
    }
  } catch (e) {
    if (json.error) {
      throw Error(json.error);
    } else {
      throw Error(response.statusText);
    }
  }
  return json;
};

export const signUp = cred =>
  fetch("/api/users", {
    method: "POST",
    headers,
    body: JSON.stringify(cred)
  }).then(handleErrors);

export const signIn = cred =>
  fetch("/api/auth/login", {
    method: "POST",
    headers,
    body: JSON.stringify(cred)
  }).then(handleErrors);

export const signOut = () =>
  fetch("/api/auth/logout", {
    method: "GET",
    headers
  }).then(handleErrors);

export const isSignedIn = () =>
  fetch("/api/auth/me", {
    method: "GET",
    headers
  }).then(handleErrors);

export const getRegistrationOptions = () =>
  fetch("/api/auth/attestation", {
    method: "GET",
    headers
  }).then(handleErrors);

export const postRegistrationResponse = res =>
  fetch("/api/auth/attestation", {
    method: "POST",
    headers,
    body: JSON.stringify(res)
  }).then(handleErrors);
