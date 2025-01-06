import fetcher from "./_fetcher";

type MutationOptions = {
  method: string;
  body?: any;
  headers?: Record<string, string>;
};

const mutation = async (url: string, options: MutationOptions): Promise<any> => {
  return await fetcher({
    url,
    options: {
      ...options,
      body: JSON.stringify(options.body),
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    },
  });
};

export default mutation;