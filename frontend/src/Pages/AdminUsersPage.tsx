import AdminTableTemplate from "../Components/AdminTableTemplate";
import adminFavIcon from "./../resources/admin-icon.png";
import Head from "../Components/Head";

const AdminUsersPage = () => {
  const tableCellConfig = [
    {
      headerText: "id",
      name: "id",
      type: "string",
    },
    {
      headerText: "username",
      name: "name",
      type: "string",
    },
    {
      headerText: "email address",
      name: "email",
      type: "string",
    },
    {
      headerText: "admin",
      name: "isAdmin",
      type: "boolean",
    },
    {
      headerText: "registration",
      name: "createdAt",
      type: "date",
    },
  ];

  const getEditPageLink = (id: string) => `/admin/users/${id}/edit`;

  return (
    <>
      <Head title="Admin | Users" favicon={adminFavIcon} />
      <AdminTableTemplate
        tableCellsConfig={tableCellConfig}
        isCreateAvailable
        getEditLinkPage={getEditPageLink}
        createPageLink="/admin/users/create"
        fetchUrl="api/admin/users"
        dataName="user"
      />
    </>
  );
};

export default AdminUsersPage;
