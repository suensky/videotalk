import React from "react";
import { Button, message } from "antd"

const constraints = {
    video: true
}

class ScreenSharing extends React.Component {
    startSharing = async (e) => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
            console.log('handleSuccess:');
            this.handleSuccess(stream);
        } catch (err) {
            this.handleError(err)
        }
    }

    handleSuccess = (stream) => {
        const video = this.refs['video'];
        const videoTracks = stream.getVideoTracks();
        console.log('The constraints: ', constraints);
        console.log('The camera device in use: ', videoTracks[0].label);
        window.stream = stream;
        video.srcObject = stream;

        stream.oninactive = () => {
            console.log("Stream paused.");
        }
    }

    handleError = (error) => {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            message.error(`Constraints not supported. Width: ${v.width.exact}, Height: $(v.height.exact)`);
        } else if (error.name === 'PermissionDeniedError') {
            message.error('Please allow using camera');
        }
        message.error(`getUserMedia error: ${error.name}`, error);
    }

    render() {
        return (
            <div className="container">
                <h1><span>Use camera</span></h1>
                <video className="video" ref="video" autoPlay playsInline></video>
                <Button onClick={this.startSharing}>Start sharing.</Button>
            </div>
        );
    }
}

export default ScreenSharing;