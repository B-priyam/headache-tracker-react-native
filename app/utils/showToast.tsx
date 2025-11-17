import { useToast } from "@/components/ui/toast";
import React, { ElementType } from "react";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";

const showToast = (
  toast: any,
  text: string,
  icon: ElementType,
  duration?: number,
  varient?: string
) => {
  toast.show({
    placement: "top",
    duration: duration ?? 1500,
    avoidKeyboard: true,
    render: () => {
      return (
        <Alert
          action={varient ?? "success"}
          className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center mt-12"
        >
          <AlertIcon as={icon} />
          <AlertText className="font-semibold text-typography-900" size="sm">
            {text}
          </AlertText>
        </Alert>
      );
    },
  });
};

export default showToast;
