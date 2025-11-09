import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useGroups } from "../graphql/hook/group";
import { IGroup } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";
import CreateGroupBtn from "../components/group/CreateGroupBtn";
import GroupTable from "../components/group/GroupTable";
import Pagination, { itemsPerPage } from "../components/general/Pagination";

const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { data, loading, error, reload } = useGroups();

  const groups = data?.groups || [];

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  if (error) {
    console.error("Error fetching groups:", error);
    return (
      <ErrorComponent
        message={
          error.message ||
          "Unable to fetch resource groups. Please check your connection."
        }
        onRetry={() => reload()}
      />
    );
  }

  const filteredGroups = (groups || []).filter((g: IGroup) =>
    g.name.toLowerCase().includes(query)
  );
  const { totalPages, data: paginatedGroups } = itemsPerPage(
    currentPage,
    filteredGroups
  );

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <LoadingDialog isLoading={loading} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">{t("nav.group")}</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            <SearchBar placeholder={t("groupsPage.searchByName")} />
          </div>
          <CreateGroupBtn allGroups={groups} />
        </div>
      </div>

      <GroupTable groups={paginatedGroups} query={query} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
