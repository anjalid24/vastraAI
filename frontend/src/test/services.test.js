import { describe, it, expect, vi, beforeEach } from "vitest";
import { makePreview, escapeXml } from "../services/designService.js";
import { listSampleMaterials } from "../services/demo.js";
describe("pattern studies", () => {
  it("is deterministic for the same inputs", () =>
    expect(makePreview({ seed: 13 }).svg).toBe(makePreview({ seed: 13 }).svg));
  it("makes distinct variations", () =>
    expect(makePreview({ seed: 13 }).svg).not.toBe(
      makePreview({ seed: 14 }).svg,
    ));
  it("respects seed zero, palette and density", () => {
    const p = makePreview({ seed: 0, density: 3, palette: "indigo" });
    expect(p.seed).toBe(0);
    expect(p.svg).toContain("#24365b");
    expect((p.svg.match(/<circle/g) || []).length).toBe(18);
  });
  it("clamps density and falls back from unsupported patterns", () => {
    const p = makePreview({ density: 500, pattern: "<script>" });
    expect(p.density).toBe(12);
    expect(p.pattern).toBe("Bandhani");
  });
  it("escapes dynamic SVG labels", () => {
    expect(escapeXml('<>&"')).toBe("&lt;&gt;&amp;&quot;");
    expect(
      makePreview({ material: "</title><script>alert(1)</script>" }).svg,
    ).not.toContain("<script>");
  });
  it("supports all craft studies without a fake authenticity score", () => {
    for (const pattern of ["Bandhani", "Ikat", "Patola"]) {
      const p = makePreview({ pattern });
      expect(p.svg).toContain("<svg");
      expect(p.authenticityScore).toBe(null);
    }
  });
});
describe("sample catalogue", () => {
  it("filters category", () =>
    expect(
      listSampleMaterials({ category: "Cotton" }).materials.map((m) => m._id),
    ).toEqual(["cotton"]));
  it("finds unavailable linen", () =>
    expect(
      listSampleMaterials({ isAvailable: false }).materials.map((m) => m._id),
    ).toEqual(["linen"]));
  it("search is trimmed and case-insensitive", () =>
    expect(listSampleMaterials({ search: " SILK " }).total).toBe(1));
  it("clamps page and returns a truthful empty state", () => {
    expect(listSampleMaterials({ page: 99, limit: 1 }).page).toBe(3);
    expect(listSampleMaterials({ search: "missing" }).total).toBe(0);
  });
});
vi.mock("../services/apiClient.js", () => ({
  default: { post: vi.fn(), get: vi.fn() },
  tokenStore: { set: vi.fn(), clear: vi.fn() },
}));
import client, { tokenStore } from "../services/apiClient.js";
import authService from "../services/authService.js";
describe("default-branch auth contract", () => {
  beforeEach(() => vi.clearAllMocks());
  it("registers at the real endpoint and reads the top-level token", async () => {
    client.post.mockResolvedValue({
      data: { token: "test-token", data: { user: { id: "test-user" } } },
    });
    const result = await authService.register({
      name: "Test",
      email: "test@example.invalid",
      password: "test-only",
      role: "artisan",
    });
    expect(client.post).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ role: "artisan" }),
    );
    expect(result.token).toBe("test-token");
    expect(tokenStore.set).toHaveBeenCalledWith("test-token");
  });
  it("does not persist malformed server sessions", async () => {
    client.post.mockResolvedValue({ data: { data: { user: { id: "test" } } } });
    await expect(
      authService.login({ email: "test", password: "test" }),
    ).rejects.toThrow("incomplete");
    expect(tokenStore.set).not.toHaveBeenCalled();
  });
});
