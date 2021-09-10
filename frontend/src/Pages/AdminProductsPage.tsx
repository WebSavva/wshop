import AdminTableTemplate from "../Components/AdminTableTemplate";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminProductsPage = () => {
  const tableCellConfig = [
    {
      headerText: "id",
      name: "id",
      type: "string",
    },
    {
      headerText: "name",
      name: "name",
      type: "string",
    },
    {
      headerText: "category",
      name: "category",
      type: "string",
    },
    {
      headerText: "price",
      name: "price",
      type: "number",
    },
    {
      headerText: "in count",
      name: "stockInCount",
      type: "string",
    },
  ];
  return (
    <>
      <Head title="Admin | Products" favicon={adminFavIcon} />
      <AdminTableTemplate
        tableCellsConfig={tableCellConfig}
        dataName="product"
        fetchUrl="api/admin/products"
        isCreateAvailable
        createPageLink="/admin/products/create"
        getEditLinkPage={(id: string) => `/admin/products/${id}/edit`}
      />
    </>
  );
};

export default AdminProductsPage;
