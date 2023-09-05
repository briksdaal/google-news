import { topicToHash } from '../assets/topics';

export default function createUrl(country, topic) {
  const topicHash = topic ? topicToHash[topic] : null;
  const topicPrefix = topic ? `/topics/${topicHash}` : '';

  return `/api${topicPrefix}?hl=en-${country}&gl=${country}&ceid=${country}:en`;
}
