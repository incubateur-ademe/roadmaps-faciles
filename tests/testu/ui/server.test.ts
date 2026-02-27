import { getTheme } from "@/ui/server";

describe("getTheme", () => {
  it('returns "Default" when settings is null', () => {
    expect(getTheme(null)).toBe("Default");
  });

  it('returns "Default" when settings is undefined', () => {
    expect(getTheme(undefined)).toBe("Default");
  });

  it('returns "Default" when uiTheme is "Default"', () => {
    expect(getTheme({ uiTheme: "Default" })).toBe("Default");
  });

  it('returns "Dsfr" when uiTheme is "Dsfr"', () => {
    expect(getTheme({ uiTheme: "Dsfr" })).toBe("Dsfr");
  });
});
