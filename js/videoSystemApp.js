import VideoSystemModel from "./videoSystemModel.js";
import VideoSystemView from "./videoSystemView.js";
import VideoSystemController from "./videoSystemController.js";

const VideoSystemApp = new VideoSystemController(
    VideoSystemModel.getInstance(),
    new VideoSystemView(),
);

export default VideoSystemApp;
