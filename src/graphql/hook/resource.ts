import {
  getResourcesQuery,
  createResourceMutation,
  getResourceByIdQuery,
} from "../query/resource";
import { useQuery, useMutation, gql } from "@apollo/client";

export const useResources = () => {
  const { data, loading, error, refetch } = useQuery(getResourcesQuery, {
    fetchPolicy: "cache-first",
  });
  return {
    resources: data?.resource,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useResource = (id: string) => {
  const { data, loading, error, refetch } = useQuery(getResourceByIdQuery, {
    variables: { id },
  });
  return {
    resource: data?.resource,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useCreateResource = () => {
  const [mutate, { loading }] = useMutation(createResourceMutation);

  const createResource = async (name: string, description: string) => {
    const {
      data: { resource },
    } = await mutate({
      variables: { input: { name, description } },
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            resource: (existingResource = []) => {
              const newResourceRef = cache.writeFragment({
                data: data.resource,
                fragment: gql`
                  fragment NewResource on Resource {
                    id
                    name
                    description
                    color
                  }
                `,
              });
              return [...existingResource, newResourceRef];
            },
          },
        });
      },
    });

    return resource;
  };
  return {
    createResource,
    loading,
  };
};
