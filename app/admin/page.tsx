import { redirect } from "next/navigation";
import { getIsAdmin } from "@/lib/admin";
import AdminAppClient from "./AdminAppClient";

const AdminPage = async () => {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) redirect("/");

  return <AdminAppClient />;
};

export default AdminPage;
