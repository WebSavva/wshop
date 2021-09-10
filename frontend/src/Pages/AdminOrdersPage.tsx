import AdminTableTemplate from "../Components/AdminTableTemplate";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminOrdersPage = () => {
  const tableCellConfig = [
    {
      headerText: "id",
      name: "id",
      type: "string",
    },
    {
      headerText: "date",
      name: "createdAt",
      type: "date",
    },
    {
      headerText: "total",
      name: "totalPrice",
      type: "number",
    },
    {
      headerText: "paid",
      name: "isPaid",
      type: "boolean",
      trueReplacementDateName: "paidAt",
    },
    {
      headerText: "delivered",
      name: "isDelivered",
      type: "boolean",
      trueReplacementDateName: "deliveredAt",
    },
  ];
  const getEditPageLink = (id: string) => `/orders/${id}`;
  return (
    <>
      <Head title="Admin | Orders" favicon={adminFavIcon} />
      <AdminTableTemplate
        tableCellsConfig={tableCellConfig}
        dataName="order"
        fetchUrl="api/admin/orders"
        getEditLinkPage={getEditPageLink}
        isCreateAvailable={false}
      />
    </>
  );
};

export default AdminOrdersPage;
