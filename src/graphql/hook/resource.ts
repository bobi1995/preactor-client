import { IResource } from "../interfaces";
import {
  getResourcesQuery,
  getResourceByIdQuery,
  assignAlternativeShiftMutation,
  assignSchedule,
  assignMassiveAlternativeShiftMutation,
  deleteAlternativeShiftMutation,
} from "../query/resource";
import { useQuery, useMutation, useLazyQuery, gql } from "@apollo/client";
import {
  CREATE_RESOURCE_MUTATION,
  UPDATE_RESOURCE_MUTATION,
  DELETE_RESOURCE_MUTATION,
} from "../mutation/resource";

export const useResources = () => {
  const { data, loading, error, refetch } = useQuery(getResourcesQuery);
  return {
    resources: data?.resource,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useScheduleResources = () => {
  const { data, loading, error, refetch } = useQuery(getResourcesQuery, {
    fetchPolicy: "cache-first",
  });
  const scheduleRes = data?.resource.filter(
    (resource: IResource) => resource.schedule
  );
  return {
    resources: scheduleRes,
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

export const useAllResourcesForGroup = () => {
  const [loadResources, { data, loading, error }] =
    useLazyQuery(getResourcesQuery);
  return {
    loadResources,
    resources: data?.resource || [],
    loading,
    error,
  };
};

export const useCreateResource = () => {
  const [mutate, { loading }] = useMutation(CREATE_RESOURCE_MUTATION);

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

export const useUpdateResource = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_RESOURCE_MUTATION);
  const updateResource = async ({
    id,
    name,
    description,
    color,
    externalCode,
    scheduleId,
  }: {
    id: number;
    name: string;
    description: string;
    color: string;
    externalCode?: string;
    scheduleId?: number;
  }) => {
    try {
      const response = await mutate({
        variables: {
          input: { id, name, description, color, externalCode, scheduleId },
        },
        refetchQueries: [{ query: getResourcesQuery }],
        awaitRefetchQueries: true,
      });
      return response.data.updateResource;
    } catch (error) {
      console.error("Failed to update resource:", error);
      throw error;
    }
  };
  return {
    updateResource,
    loading,
    error,
  };
};

export const useDeleteResource = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_RESOURCE_MUTATION);

  const deleteResource = async (id: number) => {
    try {
      const response = await mutate({
        variables: { deleteResourceId: id },
        refetchQueries: [{ query: getResourcesQuery }],
        awaitRefetchQueries: true,
      });
      return response.data.deleteResource;
    } catch (error) {
      console.error("Failed to delete resource:", error);
      throw error;
    }
  };

  return {
    deleteResource,
    loading,
    error,
  };
};
