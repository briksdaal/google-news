export default function createUrl(country, topic) {
  const topicUrlPart = topic ? `/topics/${topic}` : '';

  return `/api${topicUrlPart}?hl=en-${country}&gl=${country}&ceid=${country}:en`;
}
