import React from "react";
import PaymentDataTable from "./_components/PaymentDataTable/payment-data-table";
import DataTable from "./_components/DataTable/data-table";
import defaultData from "../../../../../userData.json";
import { columns } from "./_components/Columns/columns";

const Page = () => {
  return (
    <main>
      {/* <PaymentDataTable /> */}
      <DataTable data={defaultData} columns={columns} />
    </main>
  );
};

export default Page;
