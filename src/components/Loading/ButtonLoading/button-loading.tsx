import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

const ButtonLoading = () => {
  return (
    <Button disabled>
      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
      Cargando...
    </Button>
  );
};

export default ButtonLoading;
