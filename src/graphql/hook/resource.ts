import {
  getResourcesQuery,
  createResourceMutation,
  getResourceByIdQuery,
  assignAlternativeShiftMutation,
  assignSchedule,
  assignMassiveAlternativeShiftMutation,
  deleteAlternativeShiftMutation,
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

export const useAssignSchedule = () => {
  const [mutate, { loading }] = useMutation(assignSchedule);

  const assign = async (resourceId: string, scheduleId: string) => {
    await mutate({
      variables: { resourceId, scheduleId },
    });
  };

  return {
    assign,
    loading,
  };
};

export const useAssignAlternativeShiftToResource = () => {
  const [mutate, { loading }] = useMutation(assignAlternativeShiftMutation);

  const assignAlternativeShift = async (
    resourceId: string,
    shiftId: string,
    startDate: string,
    endDate: string
  ) => {
    await mutate({
      variables: { resourceId, shiftId, startDate, endDate },
    });
  };

  return {
    assignAlternativeShift,
    loading,
  };
};

export const useAssignMassiveAlternativeShiftToResource = () => {
  const [mutate, { loading }] = useMutation(
    assignMassiveAlternativeShiftMutation
  );

  const assignMassiveAlternativeShift = async (
    resourceIds: string[],
    shiftId: string,
    startDate: string,
    endDate: string
  ) => {
    await mutate({
      variables: { resourceIds, shiftId, startDate, endDate },
    });
  };

  return {
    assignMassiveAlternativeShift,
    loading,
  };
};

export const useDeleteAlternativeShift = () => {
  const [mutate, { loading }] = useMutation(deleteAlternativeShiftMutation);

  const deleteAlternativeShift = async (id: string) => {
    await mutate({
      variables: { id },
    });
  };

  return {
    deleteAlternativeShift,
    loading,
  };
};
