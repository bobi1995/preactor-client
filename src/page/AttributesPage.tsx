import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { IAttribute } from "../graphql/interfaces"; // You'll need to add this interface
import SearchBar from "../components/general/SearchBar";
import CreateAttributeDialog from "../components/attributes/CreateAttributeDialog";
import AttributesTable from "../components/attributes/AttributesTable";
import { useAttributes } from "../graphql/hook/attribute"; // You'll need to create this hook
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";

const AttributesPage = () => {
  const { t } = useTranslation();
  // Assuming hook exists. If not, mock it for UI testing:
  // const { attributes = [], loading = false, error = null } = { attributes: [] };
  const { attributes, loading, error } = useAttributes();
  const location = useLocation();

  if (error) return <ErrorComponent message={error.message} />;
  if (loading) return <LoadingDialog isLoading={loading} />;

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredAttributes = attributes.filter((a: IAttribute) =>
    a.name.toLowerCase().includes(query)
  );

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("attributesPage.title", "Attributes")}
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:flex-grow-0 sm:w-80">
            <SearchBar
              placeholder={t(
                "attributesPage.searchPlaceholder",
                "Search attributes..."
              )}
            />
          </div>

          <CreateAttributeDialog allAttributes={attributes || []} />
        </div>
      </div>
      <AttributesTable attributes={filteredAttributes} query={query} />
    </div>
  );
};

export default AttributesPage;
