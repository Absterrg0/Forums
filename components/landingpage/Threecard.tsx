'use client';

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer } from "./ui/3d-card";

export function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var ">
      <CardBody className="bg-white relative group/card hover:shadow-xl hover:shadow-blue-300 border border-gray-300 w-full sm:w-[45rem] h-auto rounded-xl p-0"> {/* Adjusted width */}
        <div className="w-full h-full overflow-hidden rounded-xl">
          <Image
            src="/landing.png"  // Update this with your actual image path
            height={550}         // Adjusted height
            width={900}          // Adjusted width
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 ease-out group-hover:scale-105"
            alt="Forum Website"
          />
        </div>
      </CardBody>
    </CardContainer>
  );
}
