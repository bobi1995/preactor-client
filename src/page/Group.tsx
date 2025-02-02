import { useGroups } from "../graphql/hook/group";
import InfinityLoader from "../components/general/Loader";
import ErrorComponent from "../components/general/Error";
import GroupTable from "../components/group/GroupTable";

const Group = () => {
  const { data, loading, error, reload } = useGroups();
  if (loading) {
    return <InfinityLoader />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch resources. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }
  return (
    <div>
      <GroupTable groups={data.groups} />
    </div>
  );
};

export default Group;
