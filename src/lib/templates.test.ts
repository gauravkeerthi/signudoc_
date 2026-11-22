import assert from "node:assert/strict";
import { test } from "node:test";

import { describeUnsendableTemplate } from "./templates.ts";

const role = { id: "role-1", name: "Signer" };

function signatureField(signerId = role.id) {
  return {
    height: 0.03,
    page: 1,
    required: true,
    signerId,
    type: "signature",
    width: 0.2,
    x: 0.1,
    y: 0.1,
  };
}

test("a template with no signature field cannot be sent", () => {
  assert.match(
    describeUnsendableTemplate([role], []) ?? "",
    /Add signers and place fields/,
  );
  assert.match(
    describeUnsendableTemplate(
      [role],
      [
        {
          ...signatureField(),
          label: "Note",
          type: "text",
        },
      ],
    ) ?? "",
    /Signature field/,
  );
  assert.equal(describeUnsendableTemplate([role], [signatureField()]), null);
});

test("a dropdown with fewer than two choices cannot be sent", () => {
  assert.match(
    describeUnsendableTemplate(
      [role],
      [
        signatureField(),
        {
          ...signatureField(),
          options: ["Only one"],
          type: "dropdown",
          y: 0.2,
        },
      ],
    ) ?? "",
    /dropdown/,
  );
});
