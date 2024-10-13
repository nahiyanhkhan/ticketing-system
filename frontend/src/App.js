import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StockProvider from "./contexts/StockContext";
import {
  Layout,
  LoginForm,
  PageNotFound,
  Dashboard,
  Allitems,
  Request,
  AddUser,
  ListUser,
  EditUser,
  ListStock,
  AddStock,
  EditSystemDetails,
  TicketList,
  TicketDetails,
  CreateTicket,
  MyTickets,
  MyTicketDetails,
} from "./Pages";

import AssignItem from "./Pages/AssignItems";

function App() {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userRole = userDetails ? userDetails.role : null;
  return (
    <StockProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {userRole === "user" ? (
            <>
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/my-tickets/:id" element={<MyTicketDetails />} />
              <Route path="*" element={<Navigate to="/my-tickets" replace />} />
            </>
          ) : userRole === "admin" || userRole === "superadmin" ? (
            <>
              <Route index element={<Dashboard />} />
              <Route path="stock" element={<ListStock />} />
              <Route path="stock/add" element={<AddStock />} />
              <Route path="stock/edit/:id" element={<EditSystemDetails />} />
              <Route path="allitems" element={<Allitems />} />
              <Route path="request" element={<Request />} />
              <Route path="user/add" element={<AddUser />} />
              <Route path="user" element={<ListUser />} />
              <Route path="user/edit/:id" element={<EditUser />} />
              <Route path="assigned/" element={<AssignItem />} />
              <Route path="tickets" element={<TicketList />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Route>

        <Route path="login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StockProvider>
  );
}

export default App;
