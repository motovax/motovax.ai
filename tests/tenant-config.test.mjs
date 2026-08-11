import assert from "node:assert/strict";
import { test } from "node:test";

import { buildIsolatedTenantConfig } from "../server.mjs";

function profile(overrides = {}) {
  return {
    industry: "automotive",
    branch_count: "1",
    region: "Jakarta",
    modules: ["ims", "omni", "crm"],
    goal: "conversion",
    ...overrides,
  };
}

test("konfigurasi tenant baru terisolasi dan integrasi gagal tertutup", () => {
  const config = buildIsolatedTenantConfig({
    tenantId: "tenant-baru",
    profile: profile(),
  });

  assert.deepEqual(config.features, {
    inventory_management: true,
    whatsapp_ai: true,
    social_media_automation: false,
    crm_autopilot: true,
  });
  assert.equal(config.ai.additional_prompt, "");
  assert.equal(config.ai.eval_schedule.auto_run_enabled, false);
  assert.equal(config.finance.enabled, false);
  assert.equal(config.whatsapp.jasmine_auto_assign_enabled, false);
  assert.deepEqual(config.whatsapp.call_center_contact_role_ids, []);
  assert.deepEqual(config.whatsapp.call_center_handoff_role_ids, []);
  assert.equal(config.motosocial_api_key, "");
  assert.equal(config.messenger.motosocial_profile, "motovax_tenant-baru");
  assert.equal(config.instagram_private.motosocial_profile, "motovax_tenant-baru");
  assert.equal(config.instagram_private.disconnected, true);
  assert.deepEqual(config.isolation, {
    schema_version: 1,
    ai_config_scope: "tenant",
    channel_profile_scope: "tenant",
    integration_config_scope: "tenant",
  });
});

test("objek konfigurasi antar-tenant tidak berbagi referensi atau profile channel", () => {
  const tenantA = buildIsolatedTenantConfig({ tenantId: "tenant-a", profile: profile() });
  const tenantB = buildIsolatedTenantConfig({ tenantId: "tenant-b", profile: profile() });

  tenantA.ai.additional_prompt = "rahasia tenant A";
  tenantA.whatsapp.handoff_role_ids.push("role-a");
  tenantA.social_media.design_templates.push({ id: "template-a" });

  assert.equal(tenantB.ai.additional_prompt, "");
  assert.deepEqual(tenantB.whatsapp.handoff_role_ids, []);
  assert.deepEqual(tenantB.social_media.design_templates, []);
  assert.notEqual(tenantA.messenger.motosocial_profile, tenantB.messenger.motosocial_profile);
  assert.notEqual(tenantA.instagram_private.motosocial_profile, tenantB.instagram_private.motosocial_profile);
});
