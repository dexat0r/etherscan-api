import { AxiosResponse } from 'axios';

const buildActor = () => {
  return () => {
    return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...params: any): Promise<any> {
        try {
          const { data }: AxiosResponse = await originalMethod(...params);
          return data;
        } catch (error) {
          console.log(error);
          if (error.isAxiosError) {
            const { response } = error;

            throw new Error(response.data);
          }

          throw error;
        }
      };

      return descriptor;
    };
  };
};

export { buildActor };
