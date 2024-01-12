import RestaurantTables from "./tables";
import RestaurantPrinters from "./printers";
import RestaurantDiscount from "./discount";


const Tables = () => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <RestaurantTables />
        <RestaurantDiscount />
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <RestaurantPrinters />
      </div>
    </div>
  );
};

export default Tables;
