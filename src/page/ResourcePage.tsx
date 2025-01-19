import ErrorComponent from "../components/general/Error";
import InfinityLoader from "../components/general/Loader";
import { useResource } from "../graphql/hook/resource";
import { useParams } from "react-router";
import { IOrder, IResource, IRestriction, IShift } from "../graphql/interfaces";
import { uploadFile } from "../graphql/client";
import { endpoint } from "../../dbconfig";
import { useTranslation } from "react-i18next";
import AssignShift from "../components/resourcePage/AssignShift";
import AlternativeComponent from "../components/resourcePage/alternativeShift/AlternativeComponent";

const ResourcePage = () => {
  const { t } = useTranslation("resource");
  const { id } = useParams();

  if (!id) {
    return <ErrorComponent message="Resource not found" />;
  }

  const { resource, loading, error, reload } = useResource(id);

  if (loading) {
    return <InfinityLoader />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch resource. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      if (fileName.length > 31) {
        alert("Filename must be maximum 30 characters or shorter.");
        return;
      }

      const formData = new FormData();
      formData.append("picture", file);
      formData.append("id", id);
      await uploadFile(file, id);
      reload();
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          {resource.picture ? (
            <label className="cursor-pointer">
              <img
                src={`${endpoint}/static/${resource.picture}`}
                alt={resource.name}
                className="w-16 h-16 rounded-full border border-gray-300 shadow-md"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePictureUpload(e)}
              />
            </label>
          ) : (
            <label className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border shadow-md cursor-pointer">
              <span>{t("upload")}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePictureUpload(e)}
              />
            </label>
          )}

          <div>
            <h1 className="text-2xl font-bold">{resource.name}</h1>
            <h2 className="italic text-gray-500">{resource.description}</h2>
          </div>
        </div>
        <AssignShift resourceId={resource.id} t={t} />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Resource Info and Alternative Shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Info */}
          <div className="p-4 border rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{t("selected_schedule")}</h2>
            {resource.schedule ? (
              <p className="text-gray-600">{resource.schedule.name}</p>
            ) : (
              <p className="text-gray-500">{t("no_shift")}</p>
            )}
          </div>

          {/* Alternative Shifts */}
          <AlternativeComponent t={t} resource={resource} />
        </div>

        {/* Orders */}
        <div className="p-4 border rounded-md shadow-md">
          <h2 className="text-lg font-semibold">{t("orders")}</h2>
          {resource.orders.length > 0 ? (
            <ul className="list-disc list-inside">
              {resource.orders.map((order: IOrder) => (
                <li key={order.id}>Order #{order.id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">{t("no_orders")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;
