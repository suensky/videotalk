import React from "react";
import { Button, Select, message } from "antd"
import SoundMeter from './lib/soundmeter';

const { Option } = Select;

const constraints = window.constraints = {
    audio: true,
    video: true
}

const constraints240p = {
    video: {
        width: {
            exact: 320,
        },
        height: {
            exact: 240,
        }
    }
};

const constraints480p = {
    video: {
        width: {
            exact: 640,
        },
        height: {
            exact: 480,
        }
    }
};

const constraints720p = {
    video: {
        width: {
            exact: 1280,
        },
        height: {
            exact: 720,
        }
    }
};

const constraints1080p = {
    video: {
        width: {
            exact: 1920,
        },
        height: {
            exact: 1080,
        }
    }
};

const constraints2k = {
    video: {
        width: {
            exact: 2560,
        },
        height: {
            exact: 1440,
        }
    }
};

const constraints4k = {
    video: {
        width: {
            exact: 4096,
        },
        height: {
            exact: 2160,
        }
    }
};

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.video = null;
        this.audio = null;
        this.stream = null;
        this.soundMeter = null;
        this.state = {
            //音量值
            audioLevel: 0,
        }
    }

    openCamera = async (e) => {
        if (this.video != null) {
            return;
        }
        await this.tryGetUserMedia(constraints);
        this.handleCamera(this.stream);
    }

    openAudio = async (e) => {
        if (this.audio != null) {
            return;
        }
        await this.tryGetUserMedia(constraints);
        this.handleAudio(this.stream);
    }

    testVolume = async (e) => {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        } catch (e) {
            console.log('Audio API is not supported.');
        }

        this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);

        const constraints = window.constraints = {
            audio: true,
            video: false
        };
        await this.tryGetUserMedia(constraints);
        window.stream = this.stream;
        soundMeter.connectToSource(this.stream);
        setTimeout(this.soundMeterProcess, 100);
    }

    soundMeterProcess = () => {
        var val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
        this.setState({ audioLevel: val });
        setTimeout(this.soundMeterProcess, 100);
    }

    stopStream = async (e) => {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        this.stream = null;
        this.video = null;
        this.audio = null;
    }

    tryGetUserMedia = async (constraints) => {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            this.handleError(err);
        }
    }

    updateMedia = async (constraints) => {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
        }
        await this.tryGetUserMedia(constraints);
        this.handleCamera(this.stream);
    }

    handleCamera = (stream) => {
        this.video = this.refs['video'];
        const videoTracks = stream.getVideoTracks();
        const track = videoTracks[0];
        console.log('The constraints: ', track.getConstraints());
        console.log('The camera device in use: ', videoTracks[0].label);
        window.stream = stream;
        this.video.srcObject = stream;

        stream.oninactive = () => {
            console.log("Stream paused.");
        }
    }

    handleAudio = (stream) => {
        this.audio = this.refs['audio'];
        const audioTracks = stream.getAudioTracks();
        console.log('The constraints: ', constraints);
        console.log('The audio device in use: ', audioTracks[0].label);
        window.stream = stream;
        this.audio.srcObject = stream;
        stream.oninactive = () => {
            console.log("Stream paused.");
        }
    }

    handleResolutionChange = (value) => {
        console.log(`Selected ${value}`);
        switch (value) {
            case 'p240p':
                this.updateMedia(constraints240p);
                break;
            case 'p480p':
                this.updateMedia(constraints480p);
                break;
            case 'p720p':
                this.updateMedia(constraints720p);
                break;
            case 'p1080p':
                this.updateMedia(constraints1080p);
                break;
            case 'p2k':
                this.updateMedia(constraints2k);
                break;
            case 'p4k':
                this.updateMedia(constraints4k);
                break;
        }
    }

    changeResolution = () => {
        const track = window.stream.getVideoTracks()[0];
        console.log('Apply 720p: ', JSON.stringify(constraints720p));
        track.applyConstraints(constraints720p).then(() => {
            console.log('Apply 720p successfully...');
        }).catch(err => {
            console.log('Apply 720p failed: ', err.name);
        })
    }

    handleError = (error) => {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            message.error(`Constraints not supported. Width: ${v.width.exact}, Height: $(v.height.exact)`);
        } else if (error.name === 'PermissionDeniedError') {
            message.error('Please allow using camera');
        }
        message.error(`getUserMedia error: ${error.name}`, error);
        console.log(`getUserMedia error: ${error.name}`, error);
    }

    render() {
        return (
            <div className="container">
                <h1><span>Use camera</span></h1>
                <video className="video" ref="video" autoPlay playsInline></video>
                <div className="container">
                    <Select defaultValue="p720p" style={{ width: '100px' }}
                        onChange={this.handleResolutionChange}>
                        <Option value="p240p">240p</Option>
                        <Option value="p480p">480p</Option>
                        <Option value="p720p">720p</Option>
                        <Option value="p1080p">1080p</Option>
                        <Option value="p2k">2k</Option>
                        <Option value="p4k">4k</Option>
                    </Select>
                    <Button onClick={this.changeResolution} style={{ marginLeft: '20px' }}>Dynamic resolution</Button>
                </div>
                <audio ref="audio" controls autoPlay></audio>
                <div className="container">
                    <h1>
                        <span>Audio volume</span>
                    </h1>
                    <div style={{
                        width: this.state.audioLevel + 'px',
                        height: '10px',
                        backgroundColor: '#8dc63f',
                        marginTop: '20px',
                    }}>
                    </div>
                    <span hidden={this.state.audioLevel < 1.1}>{this.state.audioLevel}</span>
                </div>
                <p className="warning">Warning: please wear headphones to avoid echo.</p>
                <div className="container">
                    <Button onClick={this.openCamera}>Open camera</Button>
                    <Button onClick={this.openAudio}>Open audio</Button>
                    <Button onClick={this.testVolume}>Test volume</Button>
                    <Button onClick={this.stopStream}>Stop</Button>
                </div>
            </div>
        );
    }
}

export default Camera;