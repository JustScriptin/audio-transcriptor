"use client";

import { NextPage } from "next";
import { RecoilRoot } from "recoil";
import HomePage from "./HomePage";


const Home: NextPage = () => {
  return (
    <RecoilRoot>
      <HomePage />
    </RecoilRoot>
  );
};

export default Home;