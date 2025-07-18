import React from "react";
import ContentDisplayer from "@/Components/Home/ContentDisplayer";
import Navigation from "@/Components/Navigation/Navigation";

const page = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navigation />
      <ContentDisplayer />
    </div>
  );
};

export default page;
