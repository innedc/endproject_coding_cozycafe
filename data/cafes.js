import fetcher from './_fetcher' // Import fetcher from where you defined it
import useSWR from 'swr'
import { API_URL } from '@/constants/Api'; // Assuming this is where the API URL is stored

// Custom hook to fetch cafes data from the backend
export default async function useCafes () {
  const response = await fetch('https://endproject-coding.onrender.com/cafes');
const result = await response.json();
setData(result);

function useCafes() {
  const { data, error } = useSWR('/api/cafes'); // example URL, adapt it to your case
  return {
    data,
    isLoading: !data && !error,
    isError: error,
  };
}

  return {
    data,
    isLoading,
    isError: error,
  };
}
