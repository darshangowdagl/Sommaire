import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const { POST, GET } = createRouteHandler({
  router: ourFileRouter,
  //config
});
