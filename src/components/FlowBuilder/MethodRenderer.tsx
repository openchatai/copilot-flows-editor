import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Method } from "./types/Swagger";
import cn from "../../utils/cn";
const methodStyles = (method: Method) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-green-500";
    case "POST":
      return "bg-blue-500";
    case "PUT":
      return "bg-yellow-500";
    case "DELETE":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
export const MethodBtn = forwardRef<
  ElementRef<"button">,
  { method: Method } & ComponentPropsWithoutRef<"button">
>(({ method, className, ...props }, _ref) => (
  <button
    {...props}
    className={cn(
      "rounded px-2 py-1 flex items-center justify-center text-white text-sm",
      methodStyles(method),
      className
    )}
  />
));

MethodBtn.displayName = "MethodBtn";
