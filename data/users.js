// src/data/users.js
import fetcher from './_fetcher'
import useSWR from 'swr';
import { API_URL } from '@/constants/Api';

// Define the fetcher function
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data');
  }
  return res.json();
};

export default function useUsers() {
  const { data, error, isLoading } = useSWR(`https://endproject-coding.onrender.com/users`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
}

export { useUsers };
