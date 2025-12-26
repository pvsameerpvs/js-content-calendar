export type PageType = "COVER" | "CONTENT" | "TABLE" | "LAST";

export interface ProposalPageData {
  id: string;
  type: PageType;
  content: any; // Flexible content structure based on type
}

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
