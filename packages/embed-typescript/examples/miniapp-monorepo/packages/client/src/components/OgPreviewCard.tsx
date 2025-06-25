import { Card, Text, Image, Group } from "@mantine/core";

interface OgPreviewCardProps {
  data: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: { url: string }[];
    ogUrl?: string;
    requestUrl?: string;
  };
}

export function OgPreviewCard({ data }: OgPreviewCardProps) {
  const { ogTitle, ogDescription, ogImage, ogUrl, requestUrl } = data;
  const imageUrl = ogImage?.[0]?.url;
  const displayUrl = ogUrl || requestUrl;

  return (
    <Card withBorder radius="md" p="sm" component="a" href={displayUrl} target="_blank" rel="noopener noreferrer">
      <Group wrap="nowrap">
        {imageUrl && (
          <Image src={imageUrl} height={80} width={80} radius="sm" alt={ogTitle || "Preview image"} />
        )}
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500} lineClamp={1}>
            {ogTitle || "No title available"}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
            {ogDescription || "No description available"}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1} mt={4}>
            {displayUrl}
          </Text>
        </div>
      </Group>
    </Card>
  );
} 
