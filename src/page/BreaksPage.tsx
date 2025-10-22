import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import CreateBreakDialog from "../components/breaks/CreateBreakDialog";
import BreaksTable from "../components/breaks/BreaksTable";
import { useBreaks } from "../graphql/hook/break";
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";

const BreaksPage = () => {
  const { t } = useTranslation();
  const { breaks, loading, error } = useBreaks();
  const location = useLocation();
  if (error) return <ErrorComponent message={error.message} />;

  if (loading) return <LoadingDialog isLoading={loading} />;
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredBreaks = breaks.filter((b: IBreaks) =>
    b.name.toLowerCase().includes(query)
  );

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("breaksPage.title")}
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            <SearchBar placeholder={t("breaksPage.searchPlaceholder")} />
          </div>

          <CreateBreakDialog allBreaks={breaks || []} />
        </div>
      </div>
      <BreaksTable breaks={filteredBreaks} query={query} />
    </div>
  );
};

export default BreaksPage;
