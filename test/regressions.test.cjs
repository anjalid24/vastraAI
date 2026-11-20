const { test } = require("node:test");
const assert = require("node:assert/strict");
process.env.JWT_SECRET = "test-only-signing-key-never-use-for-production";
const User = require("../src/models/User");
const auth = require("../src/controllers/authController");
const authService = require("../src/services/authService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = require("../src/middleware/upload");
const response = () => ({
  code: 200,
  status(n) {
    this.code = n;
    return this;
  },
  json(v) {
    this.body = v;
    return this;
  },
});
test("registration rejects self-assigned administrator before any database query", async () => {
  let queried = false;
  const original = User.findOne;
  User.findOne = () => {
    queried = true;
    throw Error("must not query");
  };
  try {
    const res = response();
    await auth.register({ body: { role: "admin" } }, res);
    assert.equal(res.code, 400);
    assert.equal(queried, false);
  } finally {
    User.findOne = original;
  }
});
test("unchanged password save hook returns once and preserves stored hash", async () => {
  const hook = User.schema.s.hooks._pres
    .get("save")
    .find((h) => h.fn.toString().includes("genSalt")).fn;
  let next = 0;
  const doc = { isModified: () => false, password: "existing-hash" };
  await hook.call(doc, () => next++);
  assert.equal(doc.password, "existing-hash");
  assert.equal(next, 1);
});
test("modified password hook hashes and remains comparable", async () => {
  const hook = User.schema.s.hooks._pres
    .get("save")
    .find((h) => h.fn.toString().includes("genSalt")).fn;
  const doc = { isModified: () => true, password: "Example-test-123!" };
  await hook.call(doc, () => {});
  assert.notEqual(doc.password, "Example-test-123!");
  assert.equal(await bcrypt.compare("Example-test-123!", doc.password), true);
});
test("tokens round-trip with HS256 and reject other algorithms", () => {
  assert.equal(
    authService.verifyToken(authService.generateToken("user-123")).id,
    "user-123",
  );
  assert.equal(
    authService.verifyToken(
      jwt.sign({ id: "user-123" }, process.env.JWT_SECRET, {
        algorithm: "HS384",
      }),
    ),
    null,
  );
});
test("email transport uses supported Nodemailer API without sending to the network", async () => {
  const mail = require("nodemailer"),
    original = mail.createTransport;
  let called = false;
  mail.createTransport = () => ({
    sendMail: async () => {
      called = true;
    },
  });
  try {
    assert.equal(
      await authService.sendResetEmail(
        "sample@example.invalid",
        "sample-token",
      ),
      true,
    );
    assert.equal(called, true);
  } finally {
    mail.createTransport = original;
  }
});
test("upload size error uses Multer code and reports default without NaN", () => {
  const res = response();
  upload.handleUploadError(
    new multer.MulterError("LIMIT_FILE_SIZE"),
    {},
    res,
    () => {},
  );
  assert.equal(res.code, 400);
  assert.match(res.body.message, /10MB/);
  assert.doesNotMatch(res.body.message, /NaN/);
});
test("Cloudinary storage imports configured v2 client without making a request", () => {
  assert.equal(
    typeof require("../src/config/cloudinary").cloudinary.uploader.upload,
    "function",
  );
  assert.equal(typeof upload.uploadSingle, "function");
});
