import VideoSystemModel from "./videoSystemModel.js";
import VideoSystemView from "./videoSystemView.js";
import VideoSystemController from "./videoSystemController.js";
import AuthenticationService from "./authentication.js";

const VideoSystemApp = new VideoSystemController(
    VideoSystemModel.getInstance(),
    new VideoSystemView(),
    AuthenticationService.getInstance(),
);

export default VideoSystemApp;
