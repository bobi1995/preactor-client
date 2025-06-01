import InfinityLoader from "../components/general/Loader";
import { useResources } from "../graphql/hook/resource";
import ErrorComponent from "../components/general/Error";
import ResourceTable from "../components/resource/Resource-table";

const Resource = () => {
  const { resources, loading, error, reload } = useResources();
  if (loading) {
    return <InfinityLoader />;
  }
  if (error) {
    console.error("Error fetching resources:", error);
    return (
      <ErrorComponent
        message="Unable to fetch resources. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }
  return (
    <div>
      <ResourceTable resources={resources} />
    </div>
  );
};

export default Resource;
