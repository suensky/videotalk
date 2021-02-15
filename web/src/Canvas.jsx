import React from "react";
import { Button } from "antd"
import '../styles/css/canvas.scss';



class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.video = {};
    }

    componentDidMount() {
        this.video = this.refs['video'];
        const constraints = window.constraints = {
            audio: false,
            video: true
        };
        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
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

    takeSnap = async (e) => {
        let canvas = this.refs['canvas'];
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;

        canvas.getContext('2d').drawImage(this.video, 0, 0, canvas.width, canvas.height);
    }

    render() {
        return (
            <div className="container">
                <div>
                    <h1><span>Take snapshot</span></h1>
                    <video className="big-video" ref="video" autoPlay playsInline></video>
                    <canvas className="big-canvas" ref='canvas'></canvas>
                </div>
                <Button onClick={this.takeSnap}>Take screenshot.</Button>
            </div>
        );
    }
}

export default Canvas;