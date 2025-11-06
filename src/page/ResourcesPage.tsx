import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useResources } from "../graphql/hook/resource";
import { IResource } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";
import CreateDialogBtn from "../components/resourcesPage/CreateDialogBtn"; // Import create button
import ResourceTable from "../components/resourcesPage/ResourceTable";
import Pagination, { itemsPerPage } from "../components/general/Pagination";
import { toast } from "react-toastify";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../utils/error-mapping"; // Assuming you have this file

const Resource: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { resources, loading, error, reload } = useResources();

  // Add a delete handler, just like SchedulesPage
  // const { remove: deleteResource } = useDeleteResource(); // <-- Add this when ready
  const handleDelete = async (id: string, name: string) => {
    try {
      // await deleteResource(id); // <-- Uncomment when hook is ready
      console.log("Delete resource:", id, name); // Placeholder
      // You'll need to add this translation key
      toast.success(t("resourceTable.deleteSuccess", { resourceName: name }));
      // reload(); // <-- Uncomment when hook is ready
    } catch (e: any) {
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
      toast.error(t(translationKey));
      throw e;
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  if (error) {
    console.error("Error fetching resources:", error);
    return (
      <ErrorComponent
        message={
          error.message ||
          "Unable to fetch resources. Please check your connection."
        }
        onRetry={() => reload()}
      />
    );
  }

  // Add filtering and pagination logic, just like SchedulesPage
  // ---
  // THE FIX: Provide a fallback empty array `[]` for filtering
  // ---
  const filteredResources = (resources || []).filter((s: IResource) =>
    s.name.toLowerCase().includes(query)
  );
  const { totalPages, data: paginatedResources } = itemsPerPage(
    currentPage,
    filteredResources
  );

  return (
    // Use the same page layout as SchedulesPage
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <LoadingDialog isLoading={loading} />

      {/* Add the header block, just like SchedulesPage */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("nav.resource")} {/* Or a new title key */}
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            {/* SearchBar is now here */}
            <SearchBar placeholder={t("resourceTable.searchByName")} />
          </div>
          {/* CreateDialogBtn is now here */}
          {/* Pass the non-filtered resources for the duplicate check */}
          <CreateDialogBtn allResources={resources || []} />
        </div>
      </div>

      {/* Pass paginated data, query, and delete handler to the table */}
      <ResourceTable resources={paginatedResources} query={query} />

      {/* Add Pagination, just like SchedulesPage */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default Resource;
