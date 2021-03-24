import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Shop } from "./Shop";

export default {
  title: "Organisms/Shop",
  component: Shop,
};

export const Control: React.FC = (props) => (
  <MemoryRouter>
    <Shop {...props}>{props.children}</Shop>
  </MemoryRouter>
);
