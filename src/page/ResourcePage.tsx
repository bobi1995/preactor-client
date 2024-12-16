import ErrorComponent from "../components/general/Error";
import InfinityLoader from "../components/general/Loader";
import { useResource } from "../graphql/hook/resource";
import { useParams } from "react-router";
import { useState } from "react";
import { IOrder, IResource, IRestriction, IShift } from "../graphql/interfaces";
import { uploadFile } from "../graphql/client";
import { endpoint } from "../../dbconfig";
import { useTranslation } from "react-i18next";

const ResourcePage = () => {
  const { t } = useTranslation("resource");
  const { id } = useParams();
  const [showShiftModal, setShowShiftModal] = useState(false);

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

  const handleSelectShift = () => {
    setShowShiftModal(true);
  };

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
      <div className="flex items-center gap-4 border-b pb-4">
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

        <h1 className="text-2xl font-bold">{resource.name}</h1>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Resource Info and Alternative Shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Info */}
          <div className="p-4 border rounded-md shadow-md">
            <h2 className="text-lg font-semibold">Resource's Info</h2>
            {resource.description ? (
              <p className="text-gray-600">{resource.description}</p>
            ) : (
              <p className="text-gray-500">No description available.</p>
            )}
          </div>

          {/* Alternative Shifts */}
          <div className="p-4 border rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{t("alternative_shift")}</h2>
            {resource.alternateShifts.length > 0 ? (
              <ul className="list-disc list-inside">
                {resource.alternateShifts.map((shift: IShift) => (
                  <li key={shift.id}>Shift ID: {shift.id}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t("no_alternative_shifts")}</p>
            )}
          </div>
        </div>

        {/* Replacable Resources and Restrictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Replacable Resources */}
          <div className="p-4 border rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{t("can_replace")}</h2>
            {resource.canReplace.length > 0 ? (
              <ul className="list-disc list-inside">
                {resource.replacable.map((replace: IResource) => (
                  <li key={replace.id}>Resource ID: {replace.id}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t("no_can_replace")}</p>
            )}
          </div>

          {/* Restrictions */}
          <div className="p-4 border rounded-md shadow-md">
            <h2 className="text-lg font-semibold">{t("restrictions")}</h2>
            {resource.restrictions.length > 0 ? (
              <ul className="list-disc list-inside">
                {resource.restrictions.map((restriction: IRestriction) => (
                  <li key={restriction.id}>Restriction ID: {restriction.id}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t("no_restrictions")}</p>
            )}
          </div>
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

      {/* Shift Selection Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold">Select a Regular Shift</h3>
            {/* Shift selection UI here */}
            <button
              onClick={() => setShowShiftModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
