import { AppController } from "./controllers/appController.js";
import { UiController } from "./controllers/uiController.js";

const app = new AppController(new UiController());
app.init();
