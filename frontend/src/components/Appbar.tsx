import { FileText, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Appbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="px-4 lg:px-6 h-14 flex items-center justify-between border-b-4 border-black-100 shadow-lg sticky top-0 bg-white z-50">
      <Link className="flex items-center justify-center" to="/">
        <FileText className="h-6 w-6" />
        <span className="ml-2 text-xl font-bold">DocSync</span>
      </Link>
      <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu className="h-6 w-6" />
      </button>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:block absolute lg:static top-14 left-0 right-0 bg-white lg:bg-transparent transition-all duration-300 ease-in-out`}
      >
        <ul className="flex flex-col lg:flex-row gap-4 p-4 lg:p-0">
          {["Features", "Pricing", "Security", "Templates"].map((item) => (
            <li key={item}>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                to={`#${item.toLowerCase()}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
