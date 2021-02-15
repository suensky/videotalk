import React from "react";
import { Button, message } from "antd"

const constraints = window.constraints = {
    audio: true,
    video: true
}

class Camera extends React.Component {
    openCamera = async (e) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('handleSuccess:');
            this.handleSuccess(stream);
        } catch (err) {
            this.handleError(err)
        }
    }

    handleSuccess = (stream) => {
        const video = this.refs['video'];
        const audio = this.refs['audio'];
        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();
        console.log('The constraints: ', constraints);
        console.log('The camera device in use: ', videoTracks[0].label);
        console.log('The audio device in use: ', audioTracks[0].label);
        window.stream = stream;
        video.srcObject = stream;
        audio.srcObject = stream;

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
                <audio ref="audio" controls autoPlay></audio>
                <p className="warning">Warning: please wear headphones to avoid echo.</p>
                <Button onClick={this.openCamera}>Start camera and microphone.</Button>
            </div>
        );
    }
}

export default Camera;