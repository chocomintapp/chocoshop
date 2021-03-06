import React from "react";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Header } from "./Header";

export default {
  title: "Organisms/Header",
  component: Header,
};

export const Control: React.FC = (props) => (
  <RecoilRoot>
    <MemoryRouter>
      <Header {...props}>{props.children}</Header>
    </MemoryRouter>
  </RecoilRoot>
);
