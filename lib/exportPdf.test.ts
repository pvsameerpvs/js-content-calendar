import { describe, expect, it, vi } from "vitest";

// Mock html2canvas and jsPDF to avoid heavy rendering in unit tests.
vi.mock("html2canvas", () => ({
  default: vi.fn(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    (canvas as any).toDataURL = () => "data:image/png;base64,TEST";
    return canvas;
  }),
}));

const saveMock = vi.fn();
const addImageMock = vi.fn();
const getWidthMock = vi.fn(() => 297);
const getHeightMock = vi.fn(() => 210);

vi.mock("jspdf", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      internal: {
        pageSize: {
          getWidth: getWidthMock,
          getHeight: getHeightMock,
        },
      },
      addImage: addImageMock,
      save: saveMock,
    })),
  };
});

import { exportA4LandscapePdf } from "./exportPdf";

describe("exportA4LandscapePdf", () => {
  it("creates a PDF and calls save()", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const pdf = await exportA4LandscapePdf(el, "test.pdf");

    expect(pdf).toBeTruthy();
    expect(addImageMock).toHaveBeenCalledTimes(1);
    expect(saveMock).toHaveBeenCalledWith("test.pdf");
  });
});
