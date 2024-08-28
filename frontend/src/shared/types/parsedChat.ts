export type ParsedChatMessageSegmentType = "text" | "quotation" | "code";

interface ParsedChatMessageSegmentBase {
  type: ParsedChatMessageSegmentType;
  text: string;
}

export interface ParsedChatMessageSegmentCode extends ParsedChatMessageSegmentBase {
  type: "code";
  language?: string;
}

export interface ParsedChatMessageSegmentQuotation extends ParsedChatMessageSegmentBase {
  type: "quotation";
  article_chunk_id: string;
}

export interface ParsedChatMessageSegmentText extends ParsedChatMessageSegmentBase {
  type: "text";
}

export type ParsedChatMessageSegment = ParsedChatMessageSegmentCode | ParsedChatMessageSegmentQuotation | ParsedChatMessageSegmentText;

export interface ParsedChatMessage {
  role: "user" | "assistant";
  timestamp: string;
  content: ParsedChatMessageSegment[];
}
