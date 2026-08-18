import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildIsolatedTenantConfig,
  COPY_DEFAULT_LLM_ALLOCATIONS_SQL,
  shouldProvisionCallCenterRole,
  tenantRoleTemplatesForProvisioning,
} from "../server.mjs";

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
    one_dashboard: false,
    data_insight: false,
    billing_menu: true,
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

test("setiap pilihan modul onboarding memiliki feature flag sendiri", () => {
  const config = buildIsolatedTenantConfig({
    tenantId: "tenant-semua-modul",
    profile: profile({
      modules: ["ims", "omni", "social", "crm", "dashboard", "insight"],
    }),
  });

  assert.deepEqual(config.features, {
    inventory_management: true,
    whatsapp_ai: true,
    social_media_automation: true,
    crm_autopilot: true,
    one_dashboard: true,
    data_insight: true,
    billing_menu: true,
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

test("role Call Center hanya diprovisi untuk modul AI Omnichannel dan bukan Mobix", () => {
  const regularTenantId = "11111111-1111-1111-1111-111111111111";
  const mobixTenantId = "4c8bdcb3-c535-4ad6-b2fb-53f5361c8489";

  assert.equal(shouldProvisionCallCenterRole({ tenantId: regularTenantId, modules: ["omni"] }), true);
  assert.equal(shouldProvisionCallCenterRole({ tenantId: regularTenantId, modules: ["dashboard"] }), false);
  assert.equal(shouldProvisionCallCenterRole({ tenantId: mobixTenantId, modules: ["omni"] }), false);

  const eligibleRoles = tenantRoleTemplatesForProvisioning({ tenantId: regularTenantId, modules: ["omni"] });
  const ineligibleRoles = tenantRoleTemplatesForProvisioning({ tenantId: regularTenantId, modules: ["ims", "crm"] });
  const mobixRoles = tenantRoleTemplatesForProvisioning({ tenantId: mobixTenantId, modules: ["omni"] });

  assert.equal(eligibleRoles.some(([name]) => name === "Call Center"), true);
  assert.equal(ineligibleRoles.some(([name]) => name === "Call Center"), false);
  assert.equal(mobixRoles.some(([name]) => name === "Call Center"), false);
  assert.equal(eligibleRoles.find(([name]) => name === "Admin")[1].includes("billing:read"), true);
  assert.equal(eligibleRoles.find(([name]) => name === "Management")[1].includes("billing:read"), true);
  assert.equal(eligibleRoles.find(([name]) => name === "PIC Agent Officer")[1].includes("billing:read"), false);
});

test("mapping Call Center awal memakai role seeded tanpa mengaktifkan Jasmine otomatis", () => {
  const config = buildIsolatedTenantConfig({
    tenantId: "11111111-1111-1111-1111-111111111111",
    profile: profile({ modules: ["omni"] }),
    callCenterRoleId: "22222222-2222-2222-2222-222222222222",
  });

  assert.deepEqual(config.whatsapp.call_center_contact_role_ids, [
    "22222222-2222-2222-2222-222222222222",
  ]);
  assert.equal(config.whatsapp.jasmine_auto_assign_enabled, false);
});

test("onboarding menyalin rantai LLM platform, bukan hanya menghapus allocation tenant baru", () => {
  assert.match(COPY_DEFAULT_LLM_ALLOCATIONS_SQL, /INSERT INTO tenant_llm_allocations/i);
  assert.match(COPY_DEFAULT_LLM_ALLOCATIONS_SQL, /FROM tenant_llm_allocations a/i);
  assert.match(COPY_DEFAULT_LLM_ALLOCATIONS_SQL, /JOIN llm_endpoints e/i);
  assert.match(COPY_DEFAULT_LLM_ALLOCATIONS_SQL, /e\.is_active = true/i);
});
