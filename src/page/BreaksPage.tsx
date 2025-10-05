import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import InfinityLoader from "../components/general/Loader";
import CreateBreakDialog from "../components/breaks/CreateBreakDialog";
import BreaksTable from "../components/breaks/BreaksTable";
import { useBreaks } from "../graphql/hook/break";
import ErrorComponent from "../components/general/Error";

const BreaksPage = () => {
  const { t } = useTranslation();
  const { breaks, loading, error } = useBreaks();
  const location = useLocation();
  if (error) return <ErrorComponent message={error.message} />;
  if (loading) return <InfinityLoader />;

  // This logic now correctly reads from the URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredBreaks = breaks.filter((b: IBreaks) =>
    b.name.toLowerCase().includes(query)
  );

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-3/4 py-6 px-1">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <SearchBar placeholder={t("breaksPage.searchPlaceholder")} />
          </div>
          <CreateBreakDialog allBreaks={breaks} />
        </div>
      </div>
      <BreaksTable breaks={filteredBreaks} query={query} />
    </div>
  );
};

export default BreaksPage;
