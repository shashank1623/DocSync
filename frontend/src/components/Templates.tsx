import React from "react";
import { Link } from "react-router-dom";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/imag4.jpg";

interface Template {
  name: string;
  image: string;
}

const templateData: Template[] = [
  { name: "Projects", image: image1 },
  { name: "Sales", image: image2 },
  { name: "Recipes", image: image3 },
  { name: "Reports", image: image4},
];

export const Templates: React.FC = () => {
  return (
    <section id="templates" className="w-full py-12 md:py-24 lg:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-6">
          Get a head start with templates
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose from a variety of dashboards, project trackers, and other professionally-designed templates to kick things off quickly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {templateData.map((template) => (
            <div key={template.name} className="flex flex-col items-center cursor-pointer">
              <img
                src={template.image}
                alt={`${template.name} template`}
                width={400}
                height={300}
                className="rounded-lg shadow-md mb-4"
              />
              <h3 className="text-lg font-semibold">{template.name}</h3>
            </div>
          ))}
        </div>

        <p className="text-center mt-12">
          Visit the{" "}
          <Link to="#" className="text-blue-500 hover:underline">
            Docs Template Gallery
          </Link>{" "}
          for more.
        </p>
      </div>
    </section>
  );
};
