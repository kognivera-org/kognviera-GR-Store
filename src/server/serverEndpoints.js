import services from "./config/endpoints/services";
import settingsFile from "../../settings";

const settings = settingsFile[process.env.NODE_ENV];

const serverEndpoints = services(
  settings.endpoints.gr,
  settings.endpoints.commerce,
  settings.endpoints.shoapp,
  settings.endpoints.otpapp
);

export default serverEndpoints;
