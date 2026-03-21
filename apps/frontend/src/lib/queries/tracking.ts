export const fetchTrackingAwb = async (query: string): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const response = await fetch(`${baseUrl}/shipments/lookup?q=${encodeURIComponent(query.trim())}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No shipment found for the provided details.');
    } else {
      throw new Error('Something went wrong. Please try again.');
    }
  }

  const data = await response.json();
  if (!data.awbNumber) {
    throw new Error('Invalid response from tracking service.');
  }
  return data.awbNumber;
};
