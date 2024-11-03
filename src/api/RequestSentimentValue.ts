import axios from 'axios';
import { API_KEY, API_URL } from '../api/config';
import { SentimentResponse } from './SentimentResponse';

export const requestSentimentScore = async (text: string) => {
    const response = await axios.post<SentimentResponse>(
    `${API_URL}?key=${API_KEY}`,
    {
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
      encodingType: 'UTF8',
    },
    {
      timeout: 5000
    }
  )
  return response.data.documentSentiment.score
};
