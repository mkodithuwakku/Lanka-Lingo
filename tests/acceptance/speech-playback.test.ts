import assert from "node:assert/strict";
import test from "node:test";
import { buildSinhalaSsml, escapeSsml } from "../../src/providers/azureSpeech.ts";

test("speech markup preserves Sinhala and escapes user-controlled XML", () => {
  const phrase = 'ඔයාට කොහොමද? <හොඳයි> & "හරි"';
  const ssml = buildSinhalaSsml(phrase, "si-LK-ThiliniNeural", 0.88);

  assert.match(ssml, /xml:lang="si-LK"/);
  assert.match(ssml, /name="si-LK-ThiliniNeural"/);
  assert.match(ssml, /rate="-12%"/);
  assert.ok(ssml.includes("ඔයාට කොහොමද?"));
  assert.ok(ssml.includes("&lt;හොඳයි&gt; &amp; &quot;හරි&quot;"));
  assert.equal(escapeSsml("'&<>\""), "&apos;&amp;&lt;&gt;&quot;");
});

test("slow playback is bounded and unsupported voices are rejected", () => {
  const ssml = buildSinhalaSsml("හෙමින් කියන්න.", "si-LK-SameeraNeural", 0.1);
  assert.match(ssml, /rate="-50%"/);
  assert.throws(
    () => buildSinhalaSsml("හෙමින් කියන්න.", "en-US-Alloy", 1),
    /Unsupported Sinhala voice/
  );
});
