import React, { createContext, useState, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  return (
    <DataContext.Provider
      value={{
        userData,
        setUserData,
        stockData,
        setStockData,
        deviceData,
        setDeviceData,
        ticketData,
        setTicketData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
