export const apiConfig = {
  apiKey: process.env.TWELVE_DATA_API_KEY || '',
  baseUrl: 'https://api.twelvedata.com',
};

export function getApiConfig() {
  if (!apiConfig.apiKey) {
    throw new Error('Twelve Data API key is missing.');
  }

  return apiConfig;
}
