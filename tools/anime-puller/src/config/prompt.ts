type EmbeddedingData = {
  synopsis: string;
  background: string;
} & Record<string, unknown>;

export const getEmbeddingContent = (data: EmbeddedingData) => {
  return [
    data.synopsis,
    data.background,
  ].filter(Boolean).join('\n\n')
}