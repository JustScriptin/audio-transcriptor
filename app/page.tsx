"use client";

import FilePicker from "@/components/FilePicker";
import { NextPage } from "next";
import "./page.module.scss"

const Home: NextPage = () => {

  return (
    <>
      <FilePicker />
    </>
  );
};

export default Home;