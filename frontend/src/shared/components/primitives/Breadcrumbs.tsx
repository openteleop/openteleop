import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => {
  return (
    <div className="text-2 flex items-center gap-3 whitespace-nowrap ">
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <React.Fragment key={index}>
            {breadcrumb.href && (
              <Link
                className={`'cursor-pointer ${index === breadcrumbs.length - 1 ? "text-accent-11 hover:text-accent-11 font-bold" : "text-gray-11 hover:text-gray-12"}`}
                to={breadcrumb.href}
              >
                {breadcrumb.label}
              </Link>
            )}
            {!breadcrumb.href && (
              <span
                className={
                  index === breadcrumbs.length - 1 ? "text-accent-11 hover:text-accent-11 font-bold" : "text-gray-11 hover:text-gray-12"
                }
              >
                {breadcrumb.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <Icon icon="chevron-right" className="text-gray-8" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
