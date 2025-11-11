import { useTranslation } from "react-i18next";
import InfinityLoader from "../components/general/Loader";
import { useScheduleResources } from "../graphql/hook/resource";
import ErrorComponent from "../components/general/Error";
import GantComponent from "../components/home/Gantt";

const Home = () => {
  const { t } = useTranslation("home");
  const { resources, loading, error, reload } = useScheduleResources();

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
    <>
      <GantComponent resources={resources} t={t} />
    </>
  );
};

export default Home;
