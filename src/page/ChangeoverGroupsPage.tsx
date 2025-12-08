import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { IChangeoverGroup } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import CreateChangeoverGroupDialog from "../components/changeoverGroups/CreateChangeOverGroupDialog";
import ChangeoverGroupsTable from "../components/changeoverGroups/ChangeoverGroupsTable";
import { useChangeoverGroups } from "../graphql/hook/changeover";
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";

const ChangeoverGroupsPage = () => {
  const { t } = useTranslation();
  const { changeoverGroups, loading, error } = useChangeoverGroups();
  const location = useLocation();

  if (error) return <ErrorComponent message={error.message} />;
  if (loading) return <LoadingDialog isLoading={loading} />;

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredGroups = changeoverGroups.filter((g: IChangeoverGroup) =>
    g.name.toLowerCase().includes(query)
  );

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("changeoverGroupsPage.title", "Changeover Groups")}
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            <SearchBar
              placeholder={t(
                "changeoverGroupsPage.searchPlaceholder",
                "Search groups..."
              )}
            />
          </div>

          <CreateChangeoverGroupDialog allGroups={changeoverGroups || []} />
        </div>
      </div>
      <ChangeoverGroupsTable groups={filteredGroups} query={query} />
    </div>
  );
};

export default ChangeoverGroupsPage;
