const authRoutes = require("express").Router();
const { User, SecurityKey } = require("../db");
const { getCookieOptions } = require("../utils");

const { Fido2Lib } = require("fido2-lib");
const {
  encodeAssertionOptions,
  encodeAttestationOptions,
  decodeAttestationResponse
} = require("webauthnjs-helper");

const { FIDO2_ORIGIN } = process.env;

const f2l = new Fido2Lib({
  timeout: 60000,
  rpName: "Express React Webauthn Demo",
  challengeSize: 128,
  authenticatorAttachment: "cross-platform"
});

authRoutes.get("/me", async (req, res) => {
  return res.send({
    user: req.user.json()
  });
});

authRoutes.get("/logout", async (req, res) => {
  return res
    .clearCookie("auth")
    .status(200)
    .send({ message: "Success" });
});

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ message: "Username & password required" });
  }
  try {
    const user = await User.findByUsername(username, {
      include: [SecurityKey]
    });

    if (user === null) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    if (!(await user.authenticate(password))) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // User has no security keys, so log him in
    if (user.securitykeys.length === 0) {
      return res.cookie("auth", user.getJwt(), getCookieOptions()).send({
        message: "success",
        user: user.json()
      });
    } else {
      const assertionOptions = await f2l.assertionOptions();
      encodeAssertionOptions(assertionOptions);
    }
    // Sign the user in.
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Error" });
  }
});

authRoutes.get("/attestation", async (req, res) => {
  const attestationOptions = await f2l.attestationOptions();
  const { user } = req;

  attestationOptions.excludeCredentials = user.securitykeys.map(key => ({
    id: key.credId,
    type: "public-key"
  }));

  attestationOptions.user = {
    id: user.id,
    name: user.username,
    displayName: user.username
  };

  const encodedAttestationOptions = encodeAttestationOptions(
    attestationOptions
  );
  req.session.challenge = encodedAttestationOptions.challenge;
  console.log(encodedAttestationOptions.challenge);

  return res.status(200).send({ ...encodedAttestationOptions });
});

authRoutes.post("/attestation", async (req, res) => {
  const { challenge } = req.session;

  req.session.challenge = "";

  try {
    const clientAttestationResponse = req.body;

    const decodedAttestationResponse = decodeAttestationResponse(
      clientAttestationResponse
    );

    const attestationExpectations = {
      challenge,
      origin: FIDO2_ORIGIN,
      factor: "either"
    };

    const result = await f2l.attestationResult(
      decodedAttestationResponse,
      attestationExpectations
    );

    const publicKey = result.authnrData.get("credentialPublicKeyPem");
    const credId = decodedAttestationResponse.id;
    const counter = result.authnrData.get("counter");

    const key = SecurityKey.build({
      name: "Test",
      credId,
      publicKey,
      counter,
      userId: req.user.id
    });

    await key.save();
    return res.status(200).send({ key: key.json() });
  } catch (e) {
    console.log(e);
    return res.status(500).send({});
  }
});

authRoutes.post("/assertion", async (req, res) => {});

module.exports = authRoutes;
